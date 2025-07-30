
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Assuming Navbar is in components
import CatFact from './components/CatFact'; // Assuming CatFact is in components
import DadJokes from './components/DadJokes'; // Assuming DadJokes is in components
import DogPics from './components/DogPics'; // Assuming DogPics is in components
import Login from './components/Login'; // Assuming Login is in components
import Signup from './components/Signup'; // Assuming Signup is in components
import ForgotPassword from './components/ForgotPassword'; // Import the ForgotPassword component

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
          {/* Public Routes (accessible whether authenticated or not) */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New: Forgot Password Route */}

          {/* Protected Routes (only accessible when authenticated) */}
          {isAuthenticated ? (
            <>
              <Route path="/cat-fact" element={<CatFact />} />
              <Route path="/dad-jokes" element={<DadJokes />} />
              <Route path="/dog-pics" element={<DogPics />} />
              {/* Default authenticated route */}
              <Route path="/" element={<Navigate to="/cat-fact" />} />
            </>
          ) : (
            /* Redirect any unauthenticated access to login */
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
