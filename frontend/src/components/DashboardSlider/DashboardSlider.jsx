import React, { useState } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiBell,
  FiLogOut 
} from 'react-icons/fi';
import { MdOutlineSpa, MdDashboard } from 'react-icons/md';
import './DashboardSlider.css';
//import logout from authservice
import { logout } from '../../services/authService';

const DashboardSlider = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const userName = "Rayen";

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    console.log(`Switched to ${tab} tab`);
  };

  const handleLogout = () => {
    logout();
    // Add your logout logic here (e.g., clearing auth tokens, redirecting, etc.)
  };

  return (
    <div className={`dash-slider ${isOpen ? 'dash-slider--open' : 'dash-slider--closed'}`}>
      <div className="dash-slider__content">
        {isOpen && (
          <>
            {/* Profile Section */}
            <div className="dash-slider__profile">
              <div className="dash-slider__avatar">
                {userName.charAt(0)}
              </div>
              <div className="dash-slider__profile-info">
                <h3>{userName}</h3>
                <span className="dash-slider__status">Online</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="dash-slider__nav">
              <div 
                className={`dash-slider__nav-item ${activeTab === 'dashboard' ? 'dash-slider__nav-item--active' : ''}`}
                onClick={() => handleTabClick('dashboard')}
              >
                <span className="dash-slider__nav-icon"><MdDashboard /></span>
                <span>Dashboard</span>
              </div>
              
              <div 
                className={`dash-slider__nav-item ${activeTab === 'plants' ? 'dash-slider__nav-item--active' : ''}`}
                onClick={() => handleTabClick('plants')}
              >
                <span className="dash-slider__nav-icon"><MdOutlineSpa /></span>
                <span>Plant Profile</span>
              </div>
              
              <div 
                className={`dash-slider__nav-item ${activeTab === 'notifications' ? 'dash-slider__nav-item--active' : ''}`}
                onClick={() => handleTabClick('notifications')}
              >
                <span className="dash-slider__nav-icon"><FiBell /></span>
                <span>Notifications</span>
                <span className="dash-slider__badge">3</span>
              </div>
            </nav>

            {/* Logout Button */}
            <div className="dash-slider__footer">
              <div 
                className="dash-slider__nav-item dash-slider__logout"
                onClick={handleLogout}
              >
                <span className="dash-slider__nav-icon"><FiLogOut /></span>
                <span>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        className={`dash-slider__toggle ${!isOpen ? 'dash-slider__toggle--closed' : ''}`}
        onClick={toggleSlider}
      >
        {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
    </div>
  );
};

export default DashboardSlider;