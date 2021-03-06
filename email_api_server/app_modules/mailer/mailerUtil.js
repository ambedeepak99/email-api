/**
 * @module Mailer/Util
 * @author Created by pravin on 5/24/2017.
 */
var filePath="mailer/mailerUtil.js";
var crypto = require('crypto');
var auth = require('../../lib/authenticate/auth');
var requestApi = require('request');
var nodemailer = require('../../lib/contact/mailer');

var mailerDbCtrl = require('./mailerDbCtrl');

var utilCtrl={};

function encryptCrypto(text, key) {
    var cipher = crypto.createCipher(_config.crypto.algorithm, key)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
utilCtrl.encryptCrypto = encryptCrypto;

function decryptCrypto(text, key) {
    var decipher = crypto.createDecipher(_config.crypto.algorithm, key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}
utilCtrl.decryptCrypto = decryptCrypto;

/**
 * uRegister - This method is used to register the user
 *
 * @param data {object} object of fields for signup
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function uRegister(data, callback) {
    var functionName = _utils.formatFunctionName(filePath, uRegister.name);
    var requiredParam = ['username', 'email', 'password'];
    var missingParam = _utils.checkRequiredMissingParam(data.post_data, requiredParam);
    if(missingParam) {
        _logger.error(missingParam);
        callback(missingParam, null);
    } else {
        data.post_data.password_enc = encryptCrypto(data.post_data.password, data.post_data.username);
        mailerDbCtrl.dbRegisterUser(data.post_data, function(err, result){
            if(err){
                callback(err, null);
            }else{
                var finalData = {total_record_inserted: result};
                callback(null, finalData);
            }
        });
    }
}
utilCtrl.uRegister = uRegister;

/**
 * uLogin - This method is used to authenticate the user
 *
 * @param data {object} object of username and password
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function uLogin(data, callback) {
    var functionName = _utils.formatFunctionName(filePath, uLogin.name);
    var requiredParam = ['username', 'password'];
    var missingParam = _utils.checkRequiredMissingParam(data.post_data, requiredParam);
    if(missingParam) {
        _logger.error(missingParam);
        callback(missingParam, null);
    } else {
        mailerDbCtrl.dbValidateUser(data.post_data, function(err, result){
            if(err){
                callback(err, null);
            }else{
                var newToken = auth.generateToken(result);
                callback(null, {token: newToken});
            }
        });
    }
}
utilCtrl.uLogin = uLogin;

/**
 * uSendEmails - This method is used to send emails
 *
 * @param data {object} object of username and password
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function uSendEmails(data, callback) {
    var functionName = _utils.formatFunctionName(filePath, uSendEmails.name);
    var requiredParam = ['to', 'subject', 'body'];
    var missingParam = _utils.checkRequiredMissingParam(data.post_data, requiredParam);
    if(missingParam) {
        _logger.error("missingParam", missingParam);
        callback(missingParam, null);
    } else {
        _async.auto({
            sparkpost: function(fcallback) {
                _logger.info("Mailer:: in sparkpost");
                var param = {
                    uri: _config.mailers.sparkpost.url,
                    method: _config.mailers.sparkpost.method,
                    headers: {
                        'Authorization': _config.mailers.sparkpost.app_key
                    },
                    post_data: {
                        "options": {
                          "sandbox": _config.mailers.sparkpost.sandbox
                        },
                        "content": {
                          "from": data.post_data.from || _config.mailers.sparkpost.from,
                          "subject": data.post_data.subject,
                          "text": data.post_data.body
                        },
                    },
                    send_from: 'sparkpost'
                };

                param.post_data.recipients = [];
                _.each(data.post_data.to, function(email){
                    param.post_data.recipients.push({"address": email});
                });

                _logger.info("Mailer:: sparkpost - params", param);

                uCallExternalApi(param, function(err, result){
                    if(err) {
                        _logger.error(functionName + " sparkpost::Sending mail failed : ", err);
                        fcallback(null, {status: false});
                    }
                    else {
                        var resp = {status: true};
                        if(result.id) {
                            resp.response = result.id;
                        }
                        fcallback(null, resp);
                    }
                });
            },
            mailgun: ["sparkpost", function(results, fcallback) {
                _logger.info("Mailer:: in mailgun");

                if(!results.sparkpost.status) {
                    var param = {
                        uri: _config.mailers.mailgun.url,
                        method: _config.mailers.mailgun.method,
                        headers: {
                            'user': _config.mailers.mailgun.app_key,
                            'Content-Type': 'application/json'
                        },
                        post_data: {
                            "from": data.post_data.from || _config.mailers.mailgun.from,
                            "to": data.post_data.to,
                            "subject": data.post_data.subject,
                            "text": data.post_data.body
                        },
                        send_from: 'mailgun'
                    };

                    _logger.info("Mailer:: mailgun - params", param);
                    uCallExternalApi(param, function(err, result){
                        if(err) {
                            _logger.error(functionName + " mailgun::Sending mail failed : ", err);
                            fcallback(null, {status: false});
                        }
                        else {
                            var resp = {status: true};
                            if(result.id) {
                                resp.response = result.id;
                            }
                            fcallback(null, resp);
                        }
                    });
                } else {
                    fcallback(null, {status: false});
                }
            }],
            nodemailer: ["mailgun", function(results, fcallback) {
                _logger.info("Mailer:: in nodemailer");
                if(!results.mailgun.status && !results.sparkpost.status) {

                    var from = data.post_data.from || _config.mailers.nodemailer.from;
                    nodemailer.sendEmail(data.post_data.body, null, data.post_data.subject, data.post_data.to, data.post_data.from, function(err, success){
                        if(err) {
                            _logger.error(functionName + " nodemailer::Sending mail failed : ", err);
                            fcallback(err, {status: false});
                        }
                        else {
                            fcallback(null, {status: true, response: success.response});
                        }
                    });
                } else {
                    fcallback(null, {status: false});
                }
            }],
        }, function(err, results) {
            console.log("Mailer:: final callback reached");
            data.post_data.user_id = data.user_id;
            if(err) {
                data.post_data.success = false;
                data.post_data.reason = err.message;
                mailerDbCtrl.dbSaveEmailLog(data.post_data, results, function(innererr, success){
                    if(innererr) {
                        callback(innererr, null);
                    } else {
                        callback(err, null);
                    }
                });
            } else {
                data.post_data.success = true;
                mailerDbCtrl.dbSaveEmailLog(data.post_data, results, function(innererr, success){
                    if(innererr) {
                        callback(innererr, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    }
}
utilCtrl.uSendEmails = uSendEmails;

/**
 * uCallExternalApi - This method is used to call the external mailer api
 *
 * @param data {object} object of information that are requied to call external api
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function uCallExternalApi(data, callback) {
    var options = {
        uri: data.uri,
        method: data.method,
        headers: data.headers,
        json: data.post_data
    };
// console.log("options", JSON.stringify(options.json));
    requestApi(options, function (error, response, body) {
        _logger.debug("Response from API:::", body);
        if (!error && response.statusCode == 200) {
            if(data.send_from == 'mailgun') {
                callback(null, {status: true, id: null});
            } else {
                if(body.results.total_accepted_recipients == data.post_data.recipients.length && !body.results.errors) {
                    _logger.info("Reqquest API:: Success ::::: id::", body.results.id);
                    callback(null, {status: true, id: body.results.id});
                } else {
                    _logger.error("Reqquest API:: Failed due to errors", body.results.errors);
                    callback(new Error(body.errors), null);
                }
            }
        } else {
            if(data.send_from == 'sparkpost') {
                _logger.error("Reqquest API:: Failed due to server error", (response.body.errors || null));
            } else {
                _logger.error("Reqquest API:: Failed due to server error", (error || null));
            }

            callback(new Error("Request API:: Failed due to server error"), null);
        }
    });
}

module.exports = utilCtrl;
