/**
 * Created by deepak on 5/10/2017.
 */
var express = require('express');
var router = express.Router();

var MailerCtrl = require('../../app_modules/mailer/mailerCtrl');

router.post("/sendmail", MailerCtrl.sendEmails);

_logger.debug("mailer route initialized");

module.exports = router;
