const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/collections
// @desc    Get all collections for a user
// @access  Private
router.get('/collections', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('collections');
    res.json(user.collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/collections
// @desc    Create a new collection
// @access  Private
router.post('/collections', [
  auth,
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, isPublic } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    // Check if collection with same name already exists
    const existingCollection = user.collections.find(c => c.name === name);
    if (existingCollection) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }
    
    // Add new collection
    user.collections.push({
      name,
      description: description || '',
      isPublic: isPublic || false
    });
    
    await user.save();
    
    res.json(user.collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/collections/:name
// @desc    Update a collection
// @access  Private
router.put('/collections/:name', auth, async (req, res) => {
  const { name, description, isPublic } = req.body;
  const oldName = req.params.name;

  try {
    const user = await User.findById(req.user.id);
    
    // Find collection index
    const collectionIndex = user.collections.findIndex(c => c.name === oldName);
    
    if (collectionIndex === -1) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    
    // Check if new name already exists (if name is being changed)
    if (name && name !== oldName) {
      const existingCollection = user.collections.find(c => c.name === name);
      if (existingCollection) {
        return res.status(400).json({ message: 'Collection with this name already exists' });
      }
    }
    
    // Update collection
    if (name) user.collections[collectionIndex].name = name;
    if (description !== undefined) user.collections[collectionIndex].description = description;
    if (isPublic !== undefined) user.collections[collectionIndex].isPublic = isPublic;
    
    await user.save();
    
    res.json(user.collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/collections/:name
// @desc    Delete a collection
// @access  Private
router.delete('/collections/:name', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Filter out the collection to delete
    user.collections = user.collections.filter(c => c.name !== req.params.name);
    
    await user.save();
    
    res.json(user.collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', [
  auth,
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;