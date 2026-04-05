const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, default: '' },
    language: { type: String, default: 'javascript' },
    explanation: { type: String, default: '' },
    approach: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    tags: [{ type: String }],
    solvedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Solution', solutionSchema);
