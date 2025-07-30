
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles/Auth.css'; // Assuming this CSS file exists for styling

// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     // Retrieve users from localStorage (our simulated database)
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(u => u.username === username && u.password === password);

//     if (user) {
//       // If user found, store logged-in user info and call onLogin prop
//       localStorage.setItem('user', JSON.stringify(user));
//       onLogin(); // Callback to update parent component's login status
//       navigate('/cat-fact'); // Navigate to the cat fact page after successful login
//     } else {
//       // Display error if credentials don't match
//       setError('Invalid username or password.');
//       // Clear the input fields for invalid data
//       setUsername('');
//       setPassword('');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-form">
//         <h2>Login</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="username">Username:</label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           {error && <p className="error-message">{error}</p>}
//           <button type="submit" className="auth-button">Login</button>
//         </form>
//         <p className="auth-switch">
//           Don't have an account? <Link to="/signup">Sign Up</Link>
//         </p>
//         {/* New: Forgot Password Link */}
//         <p className="auth-switch">
//           <Link to="/forgot-password">Forgot Password?</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css'; // Assuming this CSS file exists for styling

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usernameRef = useRef();

  useEffect(() => {
    usernameRef.current.focus(); // Autofocus on username field
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
      navigate('/cat-fact');
    } else {
      setError('Invalid username or password.');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button">Login</button>
        </form>
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
