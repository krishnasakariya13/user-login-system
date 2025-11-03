const jwt = require('jsonwebtoken');
const { signAccess, signRefresh } = require('../middleware/token');

const { AuthenticationError } = require('../utils/errors');
const ERROR_MESSAGES = require('../constants/errorMessages');

module.exports = function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return next(new AuthenticationError(ERROR_MESSAGES.MISSING_AUTHORIZATION_HEADER));

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) {
            console.error(" JWT Verify Error:", err.message)
            if (err.name === 'TokenExpiredError') {
                return next(new AuthenticationError(ERROR_MESSAGES.ACCESS_TOKEN_EXPIRED));
            } else {
                return next(new AuthenticationError(ERROR_MESSAGES.INVALID_ACCESS_TOKEN));
            }
        }
        req.user = payload;
        next();
    });
};