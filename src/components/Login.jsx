import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import Spinner from '../components/Spinner';
import { useNotification } from '../context/NotificationContext'; // ✅ STEP 1: Import

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();
  const usernameRef = useRef();

  const usernameId = useId();
  const passwordId = useId();

  const { showNotification } = useNotification(); // ✅ STEP 2: Use it

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();

      showNotification(`Welcome back, ${user.username}!`, 'success'); // ✅ Success toast
      setIsPending(true);

      setTimeout(() => {
        navigate('/cat-fact');
      }, 2000);
    } else {
      setError('Invalid username or password.');
      setUsername('');
      setPassword('');

      showNotification('Login failed. Please try again.', 'error'); // ✅ Error toast
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
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
            <label htmlFor={passwordId}>Password:</label>
            <input
              type="password"
              id={passwordId}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {isPending && <Spinner />}

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="auth-switch">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
