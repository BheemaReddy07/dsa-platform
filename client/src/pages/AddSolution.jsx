import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { createSolution, getSolution, updateSolution } from '../api';

const DEFAULTS = {
  javascript: '// Write your solution here\n\nfunction solution() {\n\n}',
  python: '# Write your solution here\n\ndef solution():\n    pass',
  java: '// Write your solution here\n\nclass Solution {\n    public void solution() {\n\n    }\n}',
  cpp: '// Write your solution here\n#include <bits/stdc++.h>\nusing namespace std;\n\nvoid solution() {\n\n}',
  c: '// Write your solution here\n#include <stdio.h>\n\nvoid solution() {\n\n}',
  typescript: '// Write your solution here\n\nfunction solution(): void {\n\n}',
};

export default function AddSolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy',
    topic: '',
    description: '',
    code: DEFAULTS.javascript,
    language: 'javascript',
    approach: '',
    explanation: '',
    timeComplexity: '',
    spaceComplexity: '',
    tags: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      getSolution(id).then((res) => {
        const s = res.data;
        setForm({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : '' });
      });
    }
  }, [id]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleLanguageChange(lang) {
    set('language', lang);
    if (!isEdit) set('code', DEFAULTS[lang] || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = isEdit
        ? await updateSolution(id, payload)
        : await createSolution(payload);
      navigate(`/solutions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">{isEdit ? 'Edit Solution' : 'Add New Solution'}</h1>

      <form className="solution-form" onSubmit={handleSubmit}>

        {/* Problem Info */}
        <div className="card">
          <div className="card-title">Problem Info</div>

          <div className="form-group">
            <label>Title *</label>
            <input
              required
              placeholder="e.g., Two Sum"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Topic *</label>
              <input
                required
                placeholder="e.g., Array, Tree, DP, Graph"
                value={form.topic}
                onChange={(e) => set('topic', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Problem Description *</label>
            <textarea
              required
              rows={5}
              placeholder="Paste or write the problem statement here..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        {/* Code */}
        <div className="card">
          <div className="card-title">Your Solution Code</div>

          <div className="form-group">
            <label>Language</label>
            <select
              value={form.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <div className="editor-wrapper">
            <Editor
              height="380px"
              language={form.language === 'cpp' ? 'cpp' : form.language}
              value={form.code}
              onChange={(val) => set('code', val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="card">
          <div className="card-title">Explanation & Notes</div>

          <div className="form-group">
            <label>Approach / Algorithm</label>
            <textarea
              rows={3}
              placeholder="e.g., Used a hash map to store seen values and look up complements in O(1)..."
              value={form.approach}
              onChange={(e) => set('approach', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Step-by-step Explanation</label>
            <textarea
              rows={5}
              placeholder="Walk through your solution in detail..."
              value={form.explanation}
              onChange={(e) => set('explanation', e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Time Complexity</label>
              <input
                placeholder="e.g., O(n)"
                value={form.timeComplexity}
                onChange={(e) => set('timeComplexity', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Space Complexity</label>
              <input
                placeholder="e.g., O(n)"
                value={form.spaceComplexity}
                onChange={(e) => set('spaceComplexity', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              placeholder="e.g., hash map, sliding window, two pointers"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Solution' : 'Save Solution'}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
