// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';
const TOKEN_EXPIRES = '7d';

// register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'username and password required' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Username or email already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });

    const userSafe = { _id: user._id, username: user.username, email: user.email };
    res.json({ status: 'ok', data: { token, user: userSafe } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ status: 'error', message: 'username/email and password required' });
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) return res.status(400).json({ status: 'error', message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ status: 'error', message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
    const userSafe = { _id: user._id, username: user.username, email: user.email };
    res.json({ status: 'ok', data: { token, user: userSafe } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// get profile (protected)
const authMiddleware = require('../middleware/authMiddleware');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ status: 'ok', data: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
