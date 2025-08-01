// src/components/Notification.jsx
import React from 'react';
import { useNotification } from '../context/NotificationContext';
import '../styles/Notification.css'; 

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
