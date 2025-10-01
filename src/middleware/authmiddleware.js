const jwt = require('jsonwebtoken');
const { signAccess, signRefresh } = require('../middleware/token');

module.exports = function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'missing authorization header' });

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) return res.status(401).json({ message: 'invalid or expired access token' });
        req.user = payload;
        next();
    });
};
