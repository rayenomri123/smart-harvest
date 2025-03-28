import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import React, { useState } from 'react';
import Notification from '../../components/Notification/Notification';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Watering Completed',
      message: 'Your Snake Plant has been successfully watered. Next watering in 7 days.',
      type: 'success',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      title: 'Low Humidity Alert',
      message: 'Humidity level in Fern Pot is at 35% (optimal: 50-60%). Consider using a humidifier.',
      type: 'warning',
      timestamp: '9:45 AM'
    },
    {
      id: 3,
      title: 'New Leaf Detected!',
      message: 'Your Monstera Deliciosa has developed 2 new leaves. Growth rate: 15% increase.',
      type: 'growth',
      timestamp: 'Yesterday'
    },
    {
      id: 4,
      title: 'Sensor Offline',
      message: 'Failed to connect to the moisture sensor in Cactus Pot. Last seen 2 hours ago.',
      type: 'error',
      timestamp: '2 hours ago'
    },
    {
      id: 5,
      title: 'Low Light Warning',
      message: 'Light levels in Orchid Corner are below optimal. Consider moving to brighter location.',
      type: 'light',
      timestamp: '45 mins ago'
    },
    {
      id: 6,
      title: 'Water Tank Low',
      message: 'Smart watering system tank at 15% capacity. Refill soon to avoid interruption.',
      type: 'water',
      timestamp: '30 mins ago'
    },
    {
      id: 7,
      title: 'Device Connected',
      message: 'New smart sensor detected in Herb Garden. Configuring settings...',
      type: 'device',
      timestamp: 'Just now'
    }
  ]);

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notif-page__container">
      <DashboardSlider />
      <main className="notif-page__main">
        <div className="notif-page__content">
          <header className="notif-page__header">
            <h1 className="notif-page__title">Plant Alerts</h1>
            <span className="notif-page__count">
              {notifications.length} active alerts
            </span>
          </header>
          
          <section className="notif-page__list">
            {notifications.length === 0 ? (
              <div className="notif-page__empty">
                <div className="notif-page__empty-icon">🌿</div>
                <p className="notif-page__empty-text">All plants are happy!</p>
                <p className="notif-page__empty-sub">No active alerts</p>
              </div>
            ) : (
              notifications.map(notification => (
                <Notification
                  key={notification.id}
                  {...notification}
                  onDismiss={() => handleDismiss(notification.id)}
                />
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;