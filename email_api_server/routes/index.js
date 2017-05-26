module.exports = function (app) {

    var authConfig = _config.authConfig;
    //region Initializing Route
    _logger.debug("Initializing Routes");

    //region Normal Route
    app.use('/user/', require('./routes_helper/loginRoute'));

    //endregion

    //region Authentication Route
    app.use(authConfig.basicAlias + '/mailer/', require('./routes_helper/mailerRoute'));

    //endregion

    _logger.debug("Initializing Routes Completed");
    //endregion

};
