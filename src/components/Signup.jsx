// import React, { useState, useRef, useEffect, useId } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles/Auth.css';

// const Signup = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const usernameRef = useRef();

//   // ✅ useId for accessibility-friendly, unique input IDs
//   const usernameId = useId();
//   const passwordId = useId();
//   const confirmPasswordId = useId();

//   useEffect(() => {
//     usernameRef.current.focus(); // Autofocus on username field
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     // --- Validation Rules ---
//     if (username.trim() === '') {
//       setError("Username cannot be empty.");
//       return;
//     }
//     if (username.length > 10) {
//       setError("Username cannot exceed 6 characters.");
//       return;
//     }

//     if (password.trim() === '') {
//       setError("Password cannot be empty.");
//       return;
//     }
//     if (password.length > 8) {
//       setError("Password cannot exceed 8 characters.");
//       return;
//     }

//     if (confirmPassword.trim() === '') {
//       setError("Confirm Password cannot be empty.");
//       return;
//     }
//     if (confirmPassword.length > 8) {
//       setError("Confirm Password cannot exceed 8 characters.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const userExists = users.some(u => u.username === username);

//     if (userExists) {
//       setError("Username already exists. Please choose a different one.");
//       return;
//     }

//     const newUser = { username, password };
//     localStorage.setItem('users', JSON.stringify([...users, newUser]));
//     navigate('/login');
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor={usernameId}>Username:</label>
//             <input
//               type="text"
//               id={usernameId}
//               ref={usernameRef}
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor={passwordId}>Password:</label>
//             <input
//               type="password"
//               id={passwordId}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor={confirmPasswordId}>Confirm Password:</label>
//             <input
//               type="password"
//               id={confirmPasswordId}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//           </div>
//           {error && <p className="error-message">{error}</p>}
//           <button type="submit" className="auth-button">Sign Up</button>
//         </form>
//         <p className="auth-switch">
//           Already have an account? <Link to="/login">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, {
  useRef,
  useEffect,
  useId,
  useActionState,
  useState
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const usernameRef = useRef();

  const usernameId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [isLoading, setIsLoading] = useState(false); // 🔄 replaces useOptimistic

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const [error, formAction] = useActionState(async (prevState, formData) => {
    const username = formData.get('username').trim();
    const password = formData.get('password').trim();
    const confirmPassword = formData.get('confirmPassword').trim();

    // --- Validation ---
    if (!username) return "Username cannot be empty.";
    if (username.length > 10) return "Username cannot exceed 10 characters.";

    if (!password) return "Password cannot be empty.";
    if (password.length > 8) return "Password cannot exceed 8 characters.";

    if (!confirmPassword) return "Confirm Password cannot be empty.";
    if (confirmPassword.length > 8) return "Confirm Password cannot exceed 8 characters.";

    if (password !== confirmPassword) return "Passwords do not match.";

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.username === username);
    if (userExists) return "Username already exists. Please choose a different one.";

    // ✅ Show loading UI
    setIsLoading(true);

    // ✅ Simulate signup delay
    const newUser = { username, password };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));

    setTimeout(() => {
      navigate('/login');
    }, 1000);

    return null;
  }, null);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>

        {isLoading && <p className="loading-message">Signing up...</p>}

        <form action={formAction}>
          <div className="form-group">
            <label htmlFor={usernameId}>Username:</label>
            <input
              type="text"
              name="username"
              id={usernameId}
              ref={usernameRef}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={passwordId}>Password:</label>
            <input
              type="password"
              name="password"
              id={passwordId}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor={confirmPasswordId}>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id={confirmPasswordId}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
