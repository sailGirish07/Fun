import React, { useState, useEffect, useRef, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const usernameRef = useRef();

  const usernameId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

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
      setNewPassword('');
      setConfirmNewPassword('');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      setMessage('Your password has been successfully reset. Redirecting to login...');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setMessage('Username not found. Please check your username.');
    }

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
            <label htmlFor={usernameId}>Username:</label>
            <input
              type="text"
              id={usernameId}
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={newPasswordId}>New Password:</label>
            <input
              type="password"
              id={newPasswordId}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={confirmPasswordId}>Confirm New Password:</label>
            <input
              type="password"
              id={confirmPasswordId}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && (
            <p className={isSuccess ? "success-message" : "error-message"}>{message}</p>
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
