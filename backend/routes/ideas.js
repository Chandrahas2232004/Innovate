import express from 'express';
import Idea from '../models/Idea.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import { predictSuccessRate, getSuccessRateExplanation } from '../utils/mlPredictor.js';
import User from '../models/User.js';

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
  console.log('Backend: POST /api/ideas - Creating new idea');
  console.log('Backend: Request body:', req.body);
  console.log('Backend: User from token:', req.user);
  const {
    title,
    description,
    category,
    targetAudience,
    requiredFunding,
    expectedImpact,
    implementationPlan,
    location
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
      location: location || undefined,
      author: req.user.id
    });
    
    // Fetch author's location for prediction
    const author = await User.findById(req.user.id).select('location');
    const authorLocation = author?.location || 'unknown';

    // Predict success rate using ML model
    const successRate = await predictSuccessRate({
      category,
      targetAudience,
      requiredFunding,
      authorLocation: (location && location !== 'unknown') ? location : authorLocation
    });
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
    implementationPlan,
    location
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
    if (location) {
      idea.location = location;
    }
    
    // Fetch author's location and re-predict success rate
    const author = await User.findById(req.user.id).select('location');
    const authorLocation = author?.location || 'unknown';

    const successRate = await predictSuccessRate({
      category,
      targetAudience,
      requiredFunding,
      authorLocation: (location && location !== 'unknown') ? location : authorLocation
    });
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

    // Fetch author's location for explanation, preferring idea.location if provided
    const author = await User.findById(idea.author).select('location');
    const authorLocation = author?.location || 'unknown';
    const effectiveLocation = (idea.location && idea.location !== 'unknown') ? idea.location : authorLocation;
    
    const modelExpl = getSuccessRateExplanation({
      category: idea.category,
      targetAudience: idea.targetAudience,
      requiredFunding: idea.requiredFunding,
      authorLocation: effectiveLocation
    });

    // Transform to legacy array the frontend expects
    const factors = [];
    const terms = modelExpl?.features?.terms || [];
    for (const t of terms) {
      const impact = (typeof t.weight === 'number' && t.weight >= 0) ? 'positive' : 'negative';
      let text;
      if (t.feature.startsWith('category:')) {
        text = `Projects in ${t.feature.split(':')[1]} category influence the success rate (${impact}).`;
      } else if (t.feature === 'requiredFunding(log-normalized)') {
        const pct = Math.round(Math.abs(t.weight) * 100);
        text = `Higher funding requirement reduces success likelihood by ~${pct}% (relative).`;
      } else if (t.feature === 'targetAudienceLength(norm)') {
        const pct = Math.round(Math.abs(t.weight) * 100);
        text = `A clearer target audience description improves success likelihood by ~${pct}% (relative).`;
      } else if (t.feature.startsWith('authorLocation:')) {
        text = `Founder location ${t.feature.split(':')[1]} affects feasibility (${impact}).`;
      } else {
        text = `${t.feature} has a ${impact} effect.`;
      }
      factors.push({ factor: t.feature, impact, explanation: text });
    }
    
    res.json({
      successRate: idea.successRate,
      explanation: factors
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


