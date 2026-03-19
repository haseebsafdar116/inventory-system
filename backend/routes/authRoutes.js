const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// In a real application, /register might be protected so only Admins can create users.
// We'll leave it open for initial setup, or you can uncomment the middleware later.
router.post('/register', register); 
router.post('/login', login);

const { User } = require('../models');

// Example protected route for verifying token
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role'] });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;
