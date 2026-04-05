import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SolutionList from './pages/SolutionList';
import SolutionPage from './pages/SolutionPage';
import AddSolution from './pages/AddSolution';
import './App.css';

function NavBar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">DSA Journal</Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>My Solutions</Link>
        <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>+ Add Solution</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SolutionList />} />
            <Route path="/solutions/:id" element={<SolutionPage />} />
            <Route path="/add" element={<AddSolution />} />
            <Route path="/solutions/:id/edit" element={<AddSolution />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
