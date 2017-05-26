/**
 * @module Mailer/Controller
 * @author Created by pravin on 5/24/2017.
 */
var filePath = "mailer/mailerCtrl.js";

var responseMsgs = _constants.RESPONSE_MESSAGES;
var auth = require('../../lib/authenticate/auth');
var mailerUtil = require('./mailerUtil');
var mailerDbCtrl = require('./mailerDbCtrl');
var mailerCtrl = {};

/**
 * loginUser - This method is used to authenticate user
 *
 * @param  request {object} Request object
 * @param  response {object} Response object
 * @return {object} returns the response
 * @author Pravin Lolage
 */
function loginUser(request, response) {
    var data = {
        service_type: "POST",
        post_data: request.body
    };

    mailerUtil.uLogin(data, function(err, result){
        if (err) {
            _utils.send(response, {
                type: responseMsgs.FAILED,
                custom_msg: err.message
            });
        }
        else {
            _utils.send(response, {
                type: responseMsgs.SUCCESS,
                data: result
            });
        }
    });
};
mailerCtrl.loginUser = loginUser;

/**
 * registerUser - This method is used to register a user
 *
 * @param  request {object} Request object
 * @param  response {object} Response object
 * @return {object} returns the response
 * @author Pravin Lolage
 */
function registerUser(request, response) {
    var data = {
        service_type: "POST",
        post_data: request.body
    };

    mailerUtil.uRegister(data, function(err, result){
        if (err) {
            _utils.send(response, {
                type: responseMsgs.FAILED,
                custom_msg: err.message
            });
        }
        else {
            _utils.send(response, {
                type: responseMsgs.SUCCESS,
                data: result
            });
        }
    });
};
mailerCtrl.registerUser = registerUser;

/**
 * sendEmails - This method is used to send mails
 *
 * @param  request {object} Request object
 * @param  response {object} Response object
 * @return {object} returns the response
 * @author Pravin Lolage
 */
function sendEmails(request, response) {
    var data = {
        service_type: "POST",
        post_data: request.body
    };

    data.user_id = (request.decoded) ? (request.decoded.payload._id || null) : null;
    mailerUtil.uSendEmails(data, function(err, result){
        if (err) {
            response.setHeader('Authorization', request.headers['authorization']);
            _utils.send(response, {
                type: responseMsgs.FAILED,
                custom_msg: err.message
            });
        }
        else {
            response.setHeader('Authorization', request.headers['authorization']);
            _utils.send(response, {
                type: responseMsgs.SUCCESS,
                data: result
            });
        }
    });
};
mailerCtrl.sendEmails = sendEmails;

module.exports = mailerCtrl;
