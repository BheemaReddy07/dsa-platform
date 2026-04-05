const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const SolvedHistory = require('../models/SolvedHistory');
const Problem = require('../models/Problem');
const { runTestCases } = require('../services/judge0');

// POST run code against test cases
router.post('/run', async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code, and language are required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // Run code against all visible test cases
    const visibleTestCases = problem.testCases.filter((tc) => !tc.isHidden);
    const testResults = await runTestCases(code, language, visibleTestCases);

    const allPassed = testResults.every((r) => r.passed);
    const status = allPassed ? 'Accepted' : 'Wrong Answer';

    // Check for compile/runtime errors
    const hasError = testResults.some((r) => r.compile_output || r.stderr);
    const finalStatus = hasError
      ? testResults[0].compile_output
        ? 'Compilation Error'
        : 'Runtime Error'
      : status;

    // Save submission
    const submission = new Submission({
      problemId,
      code,
      language,
      status: finalStatus,
      runtime: testResults[0]?.time ? `${testResults[0].time}s` : null,
      testResults,
    });
    await submission.save();

    // If accepted, update solved history
    if (finalStatus === 'Accepted') {
      await SolvedHistory.findOneAndUpdate(
        { problemId },
        { $set: { solvedAt: new Date(), language }, $inc: { attempts: 1 } },
        { upsert: true, new: true }
      );
    } else {
      // Increment attempts even on failure
      await SolvedHistory.findOneAndUpdate(
        { problemId },
        { $inc: { attempts: 1 } },
        { upsert: false }
      );
    }

    res.json({ status: finalStatus, testResults, submissionId: submission._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all submissions for a problem
router.get('/:problemId', async (req, res) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId }).sort({
      createdAt: -1,
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
