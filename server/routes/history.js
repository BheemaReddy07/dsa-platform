const express = require('express');
const router = express.Router();
const SolvedHistory = require('../models/SolvedHistory');

// GET all solved history
router.get('/', async (req, res) => {
  try {
    const history = await SolvedHistory.find()
      .populate('problemId', 'title difficulty topic')
      .sort({ solvedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats summary
router.get('/stats', async (req, res) => {
  try {
    const total = await SolvedHistory.countDocuments();
    const byDifficulty = await SolvedHistory.aggregate([
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem',
        },
      },
      { $unwind: '$problem' },
      { $group: { _id: '$problem.difficulty', count: { $sum: 1 } } },
    ]);
    res.json({ total, byDifficulty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
