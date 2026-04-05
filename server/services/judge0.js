const axios = require('axios');

const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

// Judge0 language IDs
const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

// Submit code to Judge0 and wait for result
async function runCode(code, language, stdin) {
  const languageId = LANGUAGE_IDS[language];
  if (!languageId) throw new Error(`Unsupported language: ${language}`);

  // Create submission
  const { data } = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: languageId,
      stdin: stdin || '',
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return {
    stdout: (data.stdout || '').trim(),
    stderr: data.stderr || '',
    compile_output: data.compile_output || '',
    status: data.status,
    time: data.time,
  };
}

// Run code against all test cases
async function runTestCases(code, language, testCases) {
  const results = [];

  for (const tc of testCases) {
    const result = await runCode(code, language, tc.input);

    const actual = result.stdout.trim();
    const expected = tc.expectedOutput.trim();
    const passed = actual === expected;

    results.push({
      input: tc.input,
      expectedOutput: expected,
      actualOutput: actual,
      passed,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status?.description,
      time: result.time,
    });
  }

  return results;
}

module.exports = { runCode, runTestCases, LANGUAGE_IDS };
