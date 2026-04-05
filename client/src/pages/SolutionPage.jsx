import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getSolution, deleteSolution } from '../api';

export default function SolutionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSolution(id)
      .then((res) => setSolution(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this solution?')) return;
    await deleteSolution(id);
    navigate('/');
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!solution) return <div className="loading">Solution not found.</div>;

  return (
    <div className="solution-page">
      {/* Header */}
      <div>
        <div className="action-bar">
          <Link to="/" className="btn btn-outline">← Back</Link>
          <Link to={`/solutions/${id}/edit`} className="btn btn-outline">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>

        <div className="card">
          <div className="problem-header">
            <h1>{solution.title}</h1>
            <span className={`badge ${solution.difficulty}`}>{solution.difficulty}</span>
            <span className="problem-meta">{solution.topic}</span>
            <span className="problem-meta">·</span>
            <span className="problem-meta">{new Date(solution.solvedAt).toLocaleDateString()}</span>
          </div>

          {solution.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {solution.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          )}

          <p className="description-text">{solution.description}</p>
        </div>
      </div>

      {/* Code */}
      <div className="card">
        <div className="card-title">Solution Code</div>
        <div className="code-block">
          <div className="code-block-header">
            <span>{solution.language}</span>
          </div>
          <Editor
            height="400px"
            language={solution.language === 'cpp' ? 'cpp' : solution.language}
            value={solution.code}
            theme="vs-dark"
            options={{
              readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>
      </div>

      {/* Explanation */}
      {(solution.approach || solution.explanation) && (
        <div className="card">
          <div className="card-title">Explanation & Approach</div>

          {solution.approach && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>APPROACH</p>
              <p className="explanation-text">{solution.approach}</p>
            </div>
          )}

          {solution.explanation && (
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>EXPLANATION</p>
              <p className="explanation-text">{solution.explanation}</p>
            </div>
          )}

          {(solution.timeComplexity || solution.spaceComplexity) && (
            <div className="complexity-pills" style={{ marginTop: '1rem' }}>
              {solution.timeComplexity && (
                <span className="complexity-pill">Time: <span>{solution.timeComplexity}</span></span>
              )}
              {solution.spaceComplexity && (
                <span className="complexity-pill">Space: <span>{solution.spaceComplexity}</span></span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
