import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['startuper', 'funder', 'viewer'],
    default: 'viewer'
  },
  // Startuper-specific fields
  location: {
    type: String
  },
  expertise: {
    type: [String]
  },
  // Funder-specific fields
  fundingInterests: {
    type: String
  },
  investmentRange: {
    type: String,
    enum: ['$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K+']
  },
  preferredCategories: {
    type: [String],
    enum: ['agriculture', 'education', 'healthcare', 'technology', 'infrastructure', 'other']
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;


