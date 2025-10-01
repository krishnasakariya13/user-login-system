const HTTP_STATUS = require('../constants/statusCodes');


const sendResponse = (res, statusCode, message, data = null, success = null) => {
    console.log('status==============', statusCode);
    const response = {
        success: success !== null ? success : statusCode >= 200 && statusCode < 300,
        message,
        statusCode
    };

    if (data) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};


const sendSuccess = (res, message, data = null, statusCode = HTTP_STATUS.OK) => {
    return sendResponse(res, statusCode, message, data, true);
};

const sendError = (res, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, data = null) => {
    return sendResponse(res, statusCode, message, data, false);
};

const sendValidationError = (res, message, errors = null) => {
    return sendError(res, message, HTTP_STATUS.BAD_REQUEST, errors);
};

const sendUnauthorized = (res, message) => {
    return sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
};

const sendNotFound = (res, message) => {
    return sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

const sendConflict = (res, message) => {
    return sendError(res, message, HTTP_STATUS.CONFLICT);
};

module.exports = {
    sendResponse,
    sendSuccess,
    sendError,
    sendValidationError,
    sendUnauthorized,
    sendNotFound,
    sendConflict,
};