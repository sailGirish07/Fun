import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Fun_Fact App</Link>
      </div>
      <ul className="navbar-nav">
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/cat-fact" className="nav-link">Cat Fact</Link>
            </li>
            <li className="nav-item">
              <Link to="/dad-jokes" className="nav-link">Dad Jokes</Link>
            </li>
            <li className="nav-item">
              <Link to="/dog-pics" className="nav-link">Dog Pics</Link>
            </li>
            <li className="nav-item">
              <button onClick={onLogout} className="nav-link logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;