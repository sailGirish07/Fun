import React, { useState, useRef, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usernameRef = useRef();
  
    useEffect(() => {
      usernameRef.current.focus(); // Autofocus on username field
    }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // --- Validation Rules ---
    if (username.trim() === '') {
      setError("Username cannot be empty.");
      return;
    }
    if (username.length > 10) {
      setError("Username cannot exceed 6 characters.");
      return;
    }

    if (password.trim() === '') {
      setError("Password cannot be empty.");
      return;
    }
    if (password.length > 8) {
      setError("Password cannot exceed 8 characters.");
      return;
    }

    if (confirmPassword.trim() === '') {
      setError("Confirm Password cannot be empty.");
      return;
    }
    if (confirmPassword.length > 8) {
      setError("Confirm Password cannot exceed 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // --- End Validation Rules ---


    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.username === username);

    if (userExists) {
      setError("Username already exists. Please choose a different one.");
      return;
    }

    const newUser = { username, password };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    // Instead of alert, you might want a more integrated message or modal
    // For now, we'll navigate directly after successful signup
    // alert('Signup successful! Please log in.'); // Removed alert as per guidelines
    navigate('/login'); // Navigate to login after successful signup
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
