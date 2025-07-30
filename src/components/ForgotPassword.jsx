import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; // Importing the provided CSS for styling

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

   const usernameRef = useRef();
  
    useEffect(() => {
      usernameRef.current.focus(); // Autofocus on username field
    }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages
    setIsSuccess(false); // Reset success status

    // Basic input validation
    if (username.trim() === '') {
      setMessage('Please enter your username.');
      return;
    }

    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      setMessage('Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('New password and confirm password do not match.');
      // Clear password fields for security and re-entry
      setNewPassword('');
      setConfirmNewPassword('');
      return;
    }

    // --- Simulated Password Reset Logic (Frontend Only) ---
    // In a real application, you would send these details to a backend API
    // which would securely handle the password update in a database.
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
      // User found: Update their password in the local storage array
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users)); // Save the updated users array

      setMessage('Your password has been successfully reset. Redirecting to login...');
      setIsSuccess(true);
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2-second delay
    } else {
      // Username not found in our simulated database
      // For security, it's often better to give a generic message
      // to avoid revealing if a username exists or not.
      setMessage('Username not found. Please check your username.');
      setIsSuccess(false);
    }

    // Clear all input fields after submission attempt
    setUsername('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Reset Password</h2>
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
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && (
            <p className={isSuccess ? "success-message" : "error-message"}>
              {message}
            </p>
          )}
          <button type="submit" className="auth-button">Set New Password</button>
        </form>
        <p className="auth-switch">
          Remember your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
