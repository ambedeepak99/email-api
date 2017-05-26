/**
 * @ignore Created by deepak on 5/6/2017.
 */
/**
 *
 * @ignore @type {{DEV_ENV: string, MESSAGES: {INVALID_REQUEST: {status_code: number, code: number, message: string}, TOKEN_EXPIRED: {status_code: number, code: number, message: string}, NOT_AUTHORIZED: {status_code: number, code: number, message: string}, SERVER_ERROR: {status_code: number, code: number, message: string}, NO_RECORDS_FOUND: {status_code: number, code: number, message: string}, SUCCESS: {status_code: number, code: number, message: string}}}}
 */
var constants = {
    DEV_ENV: "development",
    CUSTOM_MESSAGES:{
      MISSING_PARAMETER:"Missing parameter in request.",
      DB_ERROR:"Database query error."
    },
    RESPONSE_MESSAGES: {
        INVALID_REQUEST: {
            status_code: 400,
            code: 400,
            message: 'Invalid request'
        },
        TOKEN_EXPIRED: {
            status_code: 401,
            code: 401,
            message: 'Access token is expired.'
        },
        NOT_AUTHORIZED: {
            status_code: 401,
            code: 402,
            message: 'Unauthorized access'
        },
        SERVER_ERROR: {
            status_code: 500,
            code: 500,
            message: 'Something went wrong. Please try again later.'
        },
        SUCCESS: {
            status_code: 200,
            code: 2000,
            message: 'Success'
        },
        NO_RECORDS_FOUND: {
            status_code: 200,
            code: 3000,
            message: 'No record found.'
        },
        INCOMPLETE: {
            status_code: 200,
            code: 3001,
            message: 'Incomplete request'
        },
        INVALID_CODE: {
            status_code: 200,
            code: 3002,
            message: 'Response code and msg not mention. please select valid response code.'
        },
        FAILED: {
            status_code: 200,
            code: 3003,
            message: 'Failed'
        },
        USER_EXIST: {
            status_code: 200,
            code: 3004,
            message: 'Username or email is already exists'
        },
        INVALID_USERNAME: {
            status_code: 200,
            code: 3005,
            message: 'Invalid Username'
        },
        INVALID_PASS: {
            status_code: 200,
            code: 3006,
            message: 'Invalid Password'
        }
    }
};

module.exports=constants;
