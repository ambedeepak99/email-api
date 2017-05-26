/**
 * @module Mailer/Model
 * @author Created by pravin on 5/24/2017.
 */
var crypto = require('crypto');
var mailerUtil = require('./mailerUtil');
var filePath = "mailer/mailerDbCtrl.js";
var dbCtrl = {};

/**
 * dbValidateUser - This method is used to validate the user
 *
 * @param data {object} object of username and password
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function dbValidateUser(data, callback) {
    var functionName = _utils.formatFunctionName(filePath, dbValidateUser.name);
    var collection = _mongoConnections.emailApi.db.collection(_mongoConnections.emailApi.collectionList.users);
    var query = {username: data.username};
    collection.find(query).toArray(function (err, result) {
        if (err) {
            _logger.error(functionName + "Select error : ", _constants.DB_ERROR);
            callback(_constants.CUSTOM_MESSAGES.DB_ERROR, null);
        } else {
            if(result.length > 0) {
                if(data.password == decryptCrypto(result[0].password, result[0].username)) {
                    callback(null, result[0]);
                } else {
                    callback(_constants.RESPONSE_MESSAGES.INVALID_PASS, null);
                }
            } else {
                callback(_constants.RESPONSE_MESSAGES.INVALID_USERNAME, null);
            }
        }
    });
}
dbCtrl.dbValidateUser = dbValidateUser;

/**
 * dbValidateUser - This method is used to register the user
 *
 * @param data {object} object of username, email and password
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function dbRegisterUser(data, callback) {
    var functionName = _utils.formatFunctionName(filePath, dbRegisterUser.name);
    var collection = _mongoConnections.emailApi.db.collection(_mongoConnections.emailApi.collectionList.users);
    var query = {
        $or: [{username: data.username}, {email: data.email}]
    }
    collection.find(query).toArray(function (err, result) {
        if (err) {
            _logger.error(functionName + "Select error : ", _constants.DB_ERROR);
            callback(_constants.CUSTOM_MESSAGES.DB_ERROR, null);
        } else {
            if(result.length > 0) {
                return callback(_constants.RESPONSE_MESSAGES.USER_EXIST, null);
            } else {
                collection.insert({username: data.username, password: data.password_enc, email: data.email}, function (err, result) {
                    if (err) {
                        _logger.error(functionName + " Insert error : ", err);
                        callback(_constants.CUSTOM_MESSAGES.DB_ERROR, null);
                    }
                    else {
                        _logger.info(functionName + " Number of records inserted: " + result.insertedCount);
                        callback(null, result.insertedCount);
                    }
                });
            }
        }
    });
}
dbCtrl.dbRegisterUser = dbRegisterUser;

function decryptCrypto(text, key) {
    var decipher = crypto.createDecipher(_config.crypto.algorithm, key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

/**
 * dbSaveEmailLog - This method is used to save the email logs
 *
 * @param data {object} object of email data such as to, from, subject etc.
 * @param results {object} defines the emails sent from which api
 * @param callback {function} the function passed as callback
 * @return {none} It executes the callback
 * @author Pravin Lolage
 */
function dbSaveEmailLog(data, results, callback) {
    var collection = _mongoConnections.emailApi.db.collection(_mongoConnections.emailApi.collectionList.email_log);
    data.sent_from = null;

    console.log("results", results);
    if(results) {
        _.each(results, function(val, key){
            if(val.status) {
                data.sent_from = key;
                data.api_response = val.response;
                return;
            }
        });
    }

    data.createdon = + new Date() / 1000;
    data.updatedon = + new Date() / 1000;
    collection.insert(data, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}
dbCtrl.dbSaveEmailLog = dbSaveEmailLog;

module.exports = dbCtrl;
