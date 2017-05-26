/**
 * Created by deepak on 5/24/2017.
 */
var devConfig = require('./development');
var prodConfig = require('./production');
var mergeJSON = require('deepmerge');
/**
 *
 * @type {{authAlias: string, logConfig: {datePattern: string}}}
 */
var config = {
    authConfig: {
        basicAlias: "/v1",
        secretKey: "iAmAwesomeFullStackDeveloper",
        inactiveTimeFrame: 10,//min
        forceExpireTimeFrame: 60 //min
    },
    logConfig:{
        datePattern:".yyyy-MM-dd.HH-mm"
    },
    crypto: {
        algorithm: 'aes-256-ctr'
    },
    mailers: {
        mailgun: {
            url: 'https://api.mailgun.net/v3/mg.mailguntest.com/messages',
            app_key: 'YOUR_MAILGUN_KEY',
            method: 'POST',
            from: 'from@example.com'
        },
        sparkpost: {
            url: 'https://api.sparkpost.com/api/v1/transmissions',
            app_key: 'YOUR_SPARKPOST_KEY',
            method: 'POST',
            from: 'from@example.com',
            sandbox: true
        },
        nodemailer: {
            email: 'youremail@example.com',
            password: 'YOUR_PASSWORD',
            from: 'from@example.com'
        }
    }
};

var finalConfig = {};
if (process.env.NODE_ENV == _constants.DEV_ENV) {
    console.log("########### NODE ENVIRONMENT DEVELOPMENT ###########");
    finalConfig = mergeJSON(config, devConfig);
}
else {
    console.log("########### NODE ENVIRONMENT PRODUCTION ###########");
    finalConfig = mergeJSON(config, prodConfig);
}
module.exports = finalConfig;
