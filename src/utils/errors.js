const HTTP_STATUS = require('../constants/statusCodes');
const ERROR_MESSAGES = require('../constants/errorMessages');

class AppError extends Error {
    constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, type = 'Error') {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, field = null) {
        super(message, HTTP_STATUS.BAD_REQUEST, 'ValidationError');
        this.field = field;
    }
}
class AuthenticationError extends AppError {
    constructor(message) { super(message, HTTP_STATUS.UNAUTHORIZED, 'AuthenticationError'); }
}
class AuthorizationError extends AppError {
    constructor(message) { super(message, HTTP_STATUS.FORBIDDEN, 'AuthorizationError'); }
}
class NotFoundError extends AppError {
    constructor(message, resource = null) { super(message, HTTP_STATUS.NOT_FOUND, 'NotFoundError'); this.resource = resource; }
}
class ConflictError extends AppError {
    constructor(message, field = null) { super(message, HTTP_STATUS.CONFLICT, 'ConflictError'); this.field = field; }
}
class DatabaseError extends AppError {
    constructor(message) { super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DatabaseError'); }
}

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message, err.stack);
    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    res.status(statusCode).json({
        success: false,
        error: err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        type: err.type || 'Error',
        timestamp: err.timestamp || new Date().toISOString()
    });
};

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const validateRequired = (data, fields) => {
    const missing = fields.filter(f => !data[f]);
    if (missing.length) throw new ValidationError(`${missing.join(', ')} ${missing.length > 1 ? 'are' : 'is'} required`);
};
const validatePassword = (password) => {
    if (!password || password.length < 6) throw new ValidationError('Password must be at least 6 characters', 'password');
};

module.exports = {
    AppError, ValidationError, AuthenticationError, AuthorizationError,
    NotFoundError, ConflictError, DatabaseError,
    errorHandler, asyncHandler, validateRequired, validatePassword
};
