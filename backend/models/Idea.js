import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'education', 'healthcare', 'technology', 'infrastructure', 'other']
  },
  targetAudience: {
    type: String,
    required: true
  },
  requiredFunding: {
    type: Number,
    required: true
  },
  expectedImpact: {
    type: String
  },
  implementationPlan: {
    type: String
  },
  successRate: {
    type: Number,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestedFunders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Idea = mongoose.model('Idea', IdeaSchema);

export default Idea;


