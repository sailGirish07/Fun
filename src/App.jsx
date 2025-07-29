import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CatFact from './components/CatFact';
import DadJokes from './components/DadJokes';
import DogPics from './components/DogPics';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          {isAuthenticated ? (
            <>
              <Route path="/cat-fact" element={<CatFact />} />
              <Route path="/dad-jokes" element={<DadJokes />} />
              <Route path="/dog-pics" element={<DogPics />} />
              <Route path="/" element={<Navigate to="/cat-fact" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;