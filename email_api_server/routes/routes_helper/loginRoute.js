/**
 * Created by deepak on 5/10/2017.
 */
var express = require('express');
var router = express.Router();

var MailerCtrl = require('../../app_modules/mailer/mailerCtrl');

router.post('/signup', MailerCtrl.registerUser);
router.post('/signin', MailerCtrl.loginUser);

_logger.debug("login route initialized");

module.exports = router;
