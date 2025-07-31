// // src/context/NotificationContext.js
// import React, { createContext, useContext, useState } from 'react';

// const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//   const [notification, setNotification] = useState(null);

//   const showNotification = (message, type = 'success', duration = 3000) => {
//     setNotification({ message, type });

//     setTimeout(() => {
//       setNotification(null);
//     }, duration);
//   };

//   return (
//     <NotificationContext.Provider value={{ notification, showNotification }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => useContext(NotificationContext);
