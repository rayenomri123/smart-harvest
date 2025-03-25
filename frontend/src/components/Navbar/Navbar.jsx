import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaInfoCircle, 
  FaAddressBook, 
  FaSignInAlt, 
  FaRocket,
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo and Brand Name */}
        <div className="brand-wrapper">
          <img 
            src="./src/assets/logo.png" // Update with your logo path
            alt="Logo" 
            className="logo"
          />
          <span className="brand-name">Smart Harvest</span>
        </div>

        {/* Desktop Navigation */}
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
          <NavLink to="/sign-in" className="nav-item">
            
            <span>Sign In</span>
          </NavLink>
          <NavLink to="/sign-up" className="nav-item cta">
            <FaRocket className="icon" />
            <span>Get Started</span>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
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
        <NavLink to="/sign-in" className="nav-item">
          <FaSignInAlt className="icon" />
          <span>Sign In</span>
        </NavLink>
        <NavLink to="/sign-up" className="nav-item cta">
          <FaRocket className="icon" />
          <span>Get Started</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;