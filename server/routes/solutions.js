const express = require('express');
const router = express.Router();
const Solution = require('../models/Solution');

// GET all solutions (with filters)
router.get('/', async (req, res) => {
  try {
    const { difficulty, topic, search } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const solutions = await Solution.find(filter).sort({ createdAt: -1 });
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single solution
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ error: 'Solution not found' });
    res.json(solution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create solution
router.post('/', async (req, res) => {
  try {
    const solution = new Solution(req.body);
    await solution.save();
    res.status(201).json(solution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update solution
router.put('/:id', async (req, res) => {
  try {
    const solution = await Solution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!solution) return res.status(404).json({ error: 'Solution not found' });
    res.json(solution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE solution
router.delete('/:id', async (req, res) => {
  try {
    await Solution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Solution deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats
router.get('/meta/stats', async (req, res) => {
  try {
    const total = await Solution.countDocuments();
    const easy = await Solution.countDocuments({ difficulty: 'Easy' });
    const medium = await Solution.countDocuments({ difficulty: 'Medium' });
    const hard = await Solution.countDocuments({ difficulty: 'Hard' });
    res.json({ total, easy, medium, hard });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
