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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
