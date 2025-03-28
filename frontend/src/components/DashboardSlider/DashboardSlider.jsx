import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiBell,
  FiLogOut 
} from 'react-icons/fi';
import { MdOutlineSpa, MdDashboard } from 'react-icons/md';
import './DashboardSlider.css';
import { logout } from '../../services/authService';

const DashboardSlider = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sliderRef = useRef(null);
  const userName = "Rayen";

  const toggleSlider = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Click outside handler to close the slider
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={sliderRef} className={`dash-slider ${isOpen ? 'dash-slider--open' : 'dash-slider--closed'}`}>
      <div className="dash-slider__content">
        {isOpen && (
          <>
            <div className="dash-slider__profile">
              <div className="dash-slider__avatar">
                {userName.charAt(0)}
              </div>
              <div className="dash-slider__profile-info">
                <h3>{userName}</h3>
                <span className="dash-slider__status">Online</span>
              </div>
            </div>

            <nav className="dash-slider__nav">
              <NavLink to="/dashboard" className="dash-slider__nav-item">
                <span className="dash-slider__nav-icon"><MdDashboard /></span>
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink to="/plant-profile" className="dash-slider__nav-item">
                <span className="dash-slider__nav-icon"><MdOutlineSpa /></span>
                <span>Plant Profile</span>
              </NavLink>
              
              <NavLink to="/notifications" className="dash-slider__nav-item">
                <span className="dash-slider__nav-icon"><FiBell /></span>
                <span>Notifications</span>
                <span className="dash-slider__badge">3</span>
              </NavLink>
            </nav>

            <div className="dash-slider__footer">
              <div className="dash-slider__nav-item dash-slider__logout" onClick={handleLogout}>
                <span className="dash-slider__nav-icon"><FiLogOut /></span>
                <span>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>

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
