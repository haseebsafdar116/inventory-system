const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

router.use(authenticate);
router.use(authorize('Admin')); // Specifically restrict user management to Admins only

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user role
router.put('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    await User.update({ role }, { where: { id: req.params.id } });
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    if (req.params.id == req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Create new user (Directly via Admin)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists in system' });
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({ name, email, password_hash, role });
    res.status(201).json({ id: newUser.id, name, email, role });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

module.exports = router;
