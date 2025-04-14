import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaInfoCircle, 
  FaAddressBook, 
  FaSignInAlt, 
  FaRocket,
  FaUserPlus,
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Derive auth state directly from localStorage on every render
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleAddUser = () => {
    navigate('/sign-up');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Brand */}
        <div className="brand-wrapper">
          <img 
            src="../src/assets/logo.png"
            alt="Logo" 
            className="logo"
          />
          <span className="brand-name">Smart Harvest</span>
        </div>

        {/* Desktop Navigation (text-only) */}
        <div className="nav-links">
          <NavLink to="/" className="nav-item">
            <span>Home</span>
          </NavLink>
          <NavLink to="/about" className="nav-item">
            <span>About</span>
          </NavLink>
          <NavLink to="/contact" className="nav-item">
            <span>Contact us</span>
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/dashboard" className="nav-item">
            <span>Dashboard</span>
            </NavLink>
          ) : (<></>)}
          {isAuthenticated ? (
            <NavLink to="/sign-up" className="nav-item cta">
            <FaUserPlus className="icon" />
            <span>Add user</span>
          </NavLink>
          ) : (
            <NavLink to="/sign-up" className="nav-item cta">
              <FaRocket className="icon" />
              <span>Get Started</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation (with icons) */}
      <div className={`mobile-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" className="nav-item">
          <FaHome className="icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/about" className="nav-item">
          <FaInfoCircle className="icon" />
          <span>About</span>
        </NavLink>
        <NavLink to="/contact" className="nav-item">
          <FaAddressBook className="icon" />
          <span>Contact us</span>
        </NavLink>

        {isAuthenticated ? (
          
          <NavLink to="/sign-up" className="nav-item cta">
          <FaUserPlus className="icon" />
          <span>Add user</span>
        </NavLink>
        ) : (
          <>
            <NavLink to="/sign-in" className="nav-item">
              <FaSignInAlt className="icon" />
              <span>Sign In</span>
            </NavLink>
            <NavLink to="/sign-up" className="nav-item cta">
              <FaRocket className="icon" />
              <span>Get Started</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
