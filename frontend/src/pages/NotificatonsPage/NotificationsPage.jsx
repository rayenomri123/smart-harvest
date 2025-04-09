import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import React, { useState,useEffect } from 'react';
import Notification from '../../components/Notification/Notification';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs)+3600000;
    const date = new Date(ms);
    
    return `${date.getUTCFullYear()}/${
      String(date.getUTCMonth() + 1).padStart(2, '0')}/${
      String(date.getUTCDate()).padStart(2, '0')} ${
      String(date.getUTCHours()).padStart(2, '0')}:${
      String(date.getUTCMinutes()).padStart(2, '0')}`;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/notif/all', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: 'include' // Si vous utilisez des cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setNotifications(data.map(item => ({
          id: item.id_notif,
          id_plant: item.id_plant,
          title: item.title,
          type: item.type,
          timestamp: convertirMsEnDate(item.time), // Formatage de la date
          message: item.contenu
        })));
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  });

  const handleDismiss = async (id) => {
      try {
        const response = await fetch('http://localhost:3500/api/notif/del', {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            id:id
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error deliting notifications:', error);
      }
      setNotifications(prev => prev.filter(n => n.id !== id));
    };

  return (
    <div className="notifications-page-container">
      <DashboardSlider />
      <main className="notifications-page-main">
        <div className="notifications-page-content">
          <header className="notifications-page-header">
            <h1 className="notifications-page-title">Plant Alerts</h1>
            <span className="notifications-page-alert-count">
              {notifications.length} active alerts
            </span>
          </header>
          
          <section className="notifications-page-list">
            {notifications.length === 0 ? (
              <div className="notifications-page-empty-state">
                <div className="notifications-page-empty-icon">🌿</div>
                <p className="notifications-page-empty-text">All plants are happy!</p>
                <p className="notifications-page-empty-subtext">No active alerts</p>
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