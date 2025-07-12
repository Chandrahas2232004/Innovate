import express from 'express';
import User from '../models/User.js';
import Idea from '../models/Idea.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(`Error fetching user profile: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/users/:id/ideas
// @desc    Get all ideas by a user
// @access  Public
router.get('/:id/ideas', async (req, res) => {
  try {
    console.log(`Fetching ideas for user: ${req.params.id}`);
    
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Get ideas by user
    const ideas = await Idea.find({ author: req.params.id })
      .sort({ createdAt: -1 });
    
    res.json(ideas);
  } catch (err) {
    console.error(`Error fetching user ideas: ${err.message}`);
    
    // Check if error is due to invalid ObjectId
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;

