require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/', async (req, res) => {
  try {
    res.status(200).json({'Message': 'This api works'});
  } catch (error) {
    res.status(500).json({
      message: 'Error checking system health',
      error: error.message,
      timestamp: Date.now()
    });
  }
});

// Routes
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});