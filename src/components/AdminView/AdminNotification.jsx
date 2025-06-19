// src/components/AdminView/AdminNotification.jsx

import React, { useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import styles from './AdminNotification.module.css';

const AdminNotification = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return styles.notificationSuccess;
      case 'error':
        return styles.notificationError;
      case 'info':
        return styles.notificationInfo;
      case 'warning':
        return styles.notificationWarning;
      default:
        return styles.notificationInfo;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`${styles.notification} ${getTypeClass()}`}>
      <div className={styles.notificationContent}>
        <div className={styles.notificationIcon}>
          {getIcon()}
        </div>
        <div className={styles.notificationMessage}>
          {message}
        </div>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          title="Close notification"
        >
          <FaTimes />
        </button>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
};

export default AdminNotification;