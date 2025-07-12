import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import ideaRoutes from './routes/ideas.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB (local)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/innovate';
console.log('Connecting to MongoDB at:', mongoURI);
mongoose.connect(mongoURI, {
  dbName: 'innovate' // Force the database name
})
.then(() => {
  console.log('MongoDB connected');
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

