const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, unique: true },
    approach: { type: String },
    explanation: { type: String },
    timeComplexity: { type: String },
    spaceComplexity: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', noteSchema);
