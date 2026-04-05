const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET note for a problem
router.get('/:problemId', async (req, res) => {
  try {
    const note = await Note.findOne({ problemId: req.params.problemId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or update note (upsert)
router.post('/', async (req, res) => {
  try {
    const { problemId, approach, explanation, timeComplexity, spaceComplexity, tags } = req.body;

    const note = await Note.findOneAndUpdate(
      { problemId },
      { approach, explanation, timeComplexity, spaceComplexity, tags },
      { upsert: true, new: true }
    );

    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE note
router.delete('/:problemId', async (req, res) => {
  try {
    await Note.findOneAndDelete({ problemId: req.params.problemId });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
