import React, { useEffect, useRef, useId, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const initialState = {
  username: '',
  newPassword: '',
  confirmNewPassword: '',
  message: '',
  isSuccess: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_MESSAGE':
      return { ...state, message: action.message, isSuccess: action.isSuccess || false };
    case 'RESET_FORM':
      return { ...state, username: '', newPassword: '', confirmNewPassword: '' };
    default:
      return state;
  }
}

const ForgotPassword = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
    dispatch({ type: 'SET_MESSAGE', message: '', isSuccess: false });

    const { username, newPassword, confirmNewPassword } = state;

    if (username.trim() === '') {
      dispatch({ type: 'SET_MESSAGE', message: 'Please enter your username.' });
      return;
    }
    if (newPassword.trim() === '' || confirmNewPassword.trim() === '') {
      dispatch({ type: 'SET_MESSAGE', message: 'Please enter and confirm your new password.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      dispatch({ type: 'SET_MESSAGE', message: 'New password and confirm password do not match.' });
      dispatch({ type: 'SET_FIELD', field: 'newPassword', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'confirmNewPassword', value: '' });
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      dispatch({
        type: 'SET_MESSAGE',
        message: 'Your password has been successfully reset. Redirecting to login...',
        isSuccess: true
      });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      dispatch({ type: 'SET_MESSAGE', message: 'Username not found. Please check your username.' });
    }

    dispatch({ type: 'RESET_FORM' });
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
              value={state.username}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={newPasswordId}>New Password:</label>
            <input
              type="password"
              id={newPasswordId}
              value={state.newPassword}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'newPassword', value: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={confirmPasswordId}>Confirm New Password:</label>
            <input
              type="password"
              id={confirmPasswordId}
              value={state.confirmNewPassword}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'confirmNewPassword', value: e.target.value })}
              required
            />
          </div>
          {state.message && (
            <p className={state.isSuccess ? "success-message" : "error-message"}>{state.message}</p>
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
