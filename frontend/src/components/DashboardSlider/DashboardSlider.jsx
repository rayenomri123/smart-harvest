import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiBell,
  FiLogOut,
  FiEdit,
  FiUser,
  FiLock
} from 'react-icons/fi';
import { MdOutlineSpa, MdDashboard } from 'react-icons/md';
import './DashboardSlider.css';
import { logout } from '../../services/authService';




const DashboardSlider = () => {
  
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('dashboardSliderState');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const storedPlantString = localStorage.getItem('selectedPlant');
  const storedPlant = storedPlantString ? JSON.parse(storedPlantString) : null;
  const [notif,setNotif] = useState();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/notif/count', {
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
        
        setNotif(data.count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    fetchNotifications();
  });

  useEffect(() => {
    localStorage.setItem('dashboardSliderState', JSON.stringify(isOpen));
  }, [isOpen]);
  
  const sliderRef = useRef(null);
  const userName = localStorage?.getItem('user')

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
              <button 
                className="dash-slider__edit-btn"
                onClick={() => navigate('/profile')}
              >
                <FiEdit />
              </button>
            </div>

            <nav className="dash-slider__nav">
            <div className="separator1">Plant</div>
  <NavLink 
    to="/dashboard" 
    end
    className={({ isActive }) => 
      `dash-slider__nav-item ${isActive ? "dash-slider__nav-item--active" : ""}`
    }
  >
    <span className="dash-slider__nav-icon"><MdDashboard /></span>
    <span>Dashboard</span>
  </NavLink>
  
  <NavLink 
    to={`/${storedPlant?.id_plant}/plant-profile`} 
    end
    className={({ isActive }) => 
      `dash-slider__nav-item ${isActive ? "dash-slider__nav-item--active" : ""}`
    }
  >
    <span className="dash-slider__nav-icon"><MdOutlineSpa /></span>
    <span>Plant Profile</span>
  </NavLink>
  
  <NavLink 
    to="/notifications" 
    end
    className={({ isActive }) => 
      `dash-slider__nav-item ${isActive ? "dash-slider__nav-item--active" : ""}`
    }
  >
    <span className="dash-slider__nav-icon"><FiBell /></span>
    <span>Notifications</span>
    <span className="dash-slider__badge">{notif}</span>
  </NavLink>
  
  <div className="separator2">Account</div>
  <NavLink 
    to={`/profile`} 
    end
    className={({ isActive }) => 
      `dash-slider__nav-item ${isActive ? "dash-slider__nav-item--active" : ""}`
    }
  >
   <span className="dash-slider__nav-icon"><FiUser /></span>
    <span>Account Details</span>
  </NavLink>
  <NavLink 
    to={`/#`} 
    end
    className={({ isActive }) => 
      `dash-slider__nav-item ${isActive ? "dash-slider__nav-item--active" : ""}`
    }
  >
   <span className="dash-slider__nav-icon"><FiLock /></span>
    <span>Change Password</span>
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
