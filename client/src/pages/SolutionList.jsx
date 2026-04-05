import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSolutions, getStats } from '../api';

export default function SolutionList() {
  const [solutions, setSolutions] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ search: '', difficulty: '', topic: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const t = setTimeout(fetchSolutions, 300);
    return () => clearTimeout(t);
  }, [filters]);

  async function fetchAll() {
    try {
      const [sRes, stRes] = await Promise.all([getSolutions(), getStats()]);
      setSolutions(sRes.data);
      setStats(stRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSolutions() {
    try {
      const res = await getSolutions(filters);
      setSolutions(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const topics = [...new Set(solutions.map((s) => s.topic))].sort();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>My DSA Solutions</h1>
        <Link to="/add" className="btn btn-primary">+ Add Solution</Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-row">
          <div className="stat-card total">
            <div className="val">{stats.total}</div>
            <div className="lbl">Total Solved</div>
          </div>
          <div className="stat-card easy">
            <div className="val">{stats.easy}</div>
            <div className="lbl">Easy</div>
          </div>
          <div className="stat-card medium">
            <div className="val">{stats.medium}</div>
            <div className="lbl">Medium</div>
          </div>
          <div className="stat-card hard">
            <div className="val">{stats.hard}</div>
            <div className="lbl">Hard</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}>
          <option value="">All Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select value={filters.topic} onChange={(e) => setFilters({ ...filters, topic: e.target.value })}>
          <option value="">All Topics</option>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      {solutions.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>No solutions yet.</p>
          <Link to="/add">Add your first solution</Link>
        </div>
      ) : (
        <table className="solution-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Topic</th>
              <th>Language</th>
              <th>Solved On</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((s, i) => (
              <tr key={s._id} onClick={() => navigate(`/solutions/${s._id}`)}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{s.title}</td>
                <td><span className={`badge ${s.difficulty}`}>{s.difficulty}</span></td>
                <td style={{ color: 'var(--text-muted)' }}>{s.topic}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.language}</td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(s.solvedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
