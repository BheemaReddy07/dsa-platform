const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const solutionRoutes = require('./routes/solutions');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/solutions', solutionRoutes);

app.get('/', (req, res) => res.json({ message: 'DSA Platform API running' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).catch((err) => console.error('MongoDB connection error:', err));

// Only listen locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
