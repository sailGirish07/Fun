import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// // src/main.jsx
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';

// import { NotificationProvider } from './context/NotificationContext';
// import Notification from './components/Notification';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <NotificationProvider>
//       <App />
//       <Notification />
//     </NotificationProvider>
//   </React.StrictMode>
// );
