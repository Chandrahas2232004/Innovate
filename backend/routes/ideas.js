import express from 'express';
import Idea from '../models/Idea.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import { predictSuccessRate, getSuccessRateExplanation } from '../utils/mlPredictor.js';

const router = express.Router();

// @route   GET api/ideas
// @desc    Get all ideas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 })
      .populate('author', ['name', 'location'])
      .populate('interestedFunders', ['name', 'location']);
    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ideas/:id
// @desc    Get idea by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log('Backend: Fetching idea with ID:', req.params.id);
    const idea = await Idea.findById(req.params.id)
      .populate('author', ['name', 'location'])
      .populate('interestedFunders', ['name', 'location']);
    
    if (!idea) {
      console.log('Backend: Idea not found for ID:', req.params.id);
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    console.log('Backend: Idea found:', idea.title);
    res.json(idea);
  } catch (err) {
    console.error('Backend: Error fetching idea:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/ideas
// @desc    Create a new idea
// @access  Private (Startupers only)
router.post('/', [auth, roleCheck('startuper')], async (req, res) => {
  const {
    title,
    description,
    category,
    targetAudience,
    requiredFunding,
    expectedImpact,
    implementationPlan
  } = req.body;
  
  try {
    const newIdea = new Idea({
      title,
      description,
      category,
      targetAudience,
      requiredFunding,
      expectedImpact,
      implementationPlan,
      author: req.user.id
    });
    
    // Predict success rate using ML model
    const successRate = await predictSuccessRate(newIdea);
    newIdea.successRate = successRate;
    
    const idea = await newIdea.save();
    
    res.json(idea);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ideas/:id
// @desc    Update an idea
// @access  Private (Idea owner only)
router.put('/:id', auth, async (req, res) => {
  const {
    title,
    description,
    category,
    targetAudience,
    requiredFunding,
    expectedImpact,
    implementationPlan
  } = req.body;
  
  try {
    let idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    // Check if user is the idea owner
    if (idea.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Update fields
    idea.title = title;
    idea.description = description;
    idea.category = category;
    idea.targetAudience = targetAudience;
    idea.requiredFunding = requiredFunding;
    idea.expectedImpact = expectedImpact;
    idea.implementationPlan = implementationPlan;
    
    // Re-predict success rate
    const successRate = await predictSuccessRate(idea);
    idea.successRate = successRate;
    
    await idea.save();
    
    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/ideas/:id
// @desc    Delete an idea
// @access  Private (Idea owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    // Check if user is the idea owner
    if (idea.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await idea.remove();
    
    res.json({ msg: 'Idea removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/ideas/:id/interest
// @desc    Express interest in an idea (for funders)
// @access  Private (Funders only)
router.put('/:id/interest', [auth, roleCheck('funder')], async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    // Check if the funder has already expressed interest
    console.log('Backend: Checking if user already interested. User ID:', req.user.id);
    console.log('Backend: Current interestedFunders:', idea.interestedFunders);
    
    if (idea.interestedFunders.includes(req.user.id)) {
      console.log('Backend: User already interested');
      return res.status(400).json({ msg: 'Already expressed interest in this idea' });
    }
    
    console.log('Backend: Adding user to interestedFunders');
    idea.interestedFunders.push(req.user.id);
    console.log('Backend: Updated interestedFunders:', idea.interestedFunders);
    
    await idea.save();
    
    // Populate the interestedFunders before sending response
    const updatedIdea = await Idea.findById(req.params.id)
      .populate('author', ['name', 'location'])
      .populate('interestedFunders', ['name', 'location']);
    
    console.log('Backend: Sending response with interestedFunders count:', updatedIdea.interestedFunders?.length);
    console.log('Backend: Response interestedFunders:', updatedIdea.interestedFunders);
    
    res.json(updatedIdea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/ideas/:id/explanation
// @desc    Get explanation for success rate prediction
// @access  Public
router.get('/:id/explanation', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    
    const explanation = getSuccessRateExplanation(idea);
    
    res.json({
      successRate: idea.successRate,
      explanation
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server Error');
  }
});

export default router;


