// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';

module.exports = function (req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-access-token'] || req.query.token;
  if (!token) return res.status(401).json({ status: 'error', message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.username = decoded.username;
    next();
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};
