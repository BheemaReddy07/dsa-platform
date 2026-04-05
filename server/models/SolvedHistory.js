const mongoose = require('mongoose');

const solvedHistorySchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true, unique: true },
    solvedAt: { type: Date, default: Date.now },
    attempts: { type: Number, default: 1 },
    language: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SolvedHistory', solvedHistorySchema);
