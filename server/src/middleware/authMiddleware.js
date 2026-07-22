
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];


    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const tokenParts = authHeader.split(' ');


    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Invalid token format. Use Bearer <token>' });
    }

    const token = tokenParts[1];

    try {
        const secret = process.env.JWT_SECRET || 'test_secret_for_testing';
        const decoded = jwt.verify(token, secret);


        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};
