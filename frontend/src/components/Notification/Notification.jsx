import React from 'react';
import { 
  FaTimes, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTint,
  FaSun,
  FaPlug,
  FaLeaf
} from 'react-icons/fa';
import './Notification.css';

const Notification = ({ 
  title, 
  message, 
  type = 'info', 
  timestamp, 
  onDismiss 
}) => {
  const getIcon = () => {
    switch(type) {
      case 'success':
        return <FaCheckCircle className="notif__icon" />;
      case 'error':
        return <FaExclamationTriangle className="notif__icon" />;
      case 'warning':
        return <FaExclamationTriangle className="notif__icon" />;
      case 'water':
        return <FaTint className="notif__icon" />;
      case 'light':
        return <FaSun className="notif__icon" />;
      case 'device':
        return <FaPlug className="notif__icon" />;
      case 'growth':
        return <FaLeaf className="notif__icon" />;
      default:
        return <FaInfoCircle className="notif__icon" />;
    }
  };

  return (
    <div className={`notif notif--${type}`}>
      <button 
        className="notif__dismiss" 
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <FaTimes className="notif__dismiss-icon" />
      </button>
      <div className="notif__content">
        <div className="notif__icon-container">
          {getIcon()}
        </div>
        <div className="notif__text">
          <div className="notif__header">
            <h3 className="notif__title">{title}</h3>
            {timestamp && <span className="notif__time">{timestamp}</span>}
          </div>
          <p className="notif__message">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
