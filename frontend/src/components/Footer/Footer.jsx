import React from 'react';
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="brand-section">
          <h2 className="logo">SMART HARVEST</h2>
          <p className="tagline">
            Smart Harvest tracks soil moisture, temperature, and sunlight to optimize irrigation and boost plant health.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://github.com" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="links-section">
          <div className="link-column">
            <h4 className="column-heading">Products</h4>
            <ul className="link-list">
              <li><a href="#">Irrigation Systems</a></li>
              <li><a href="#">Soil Sensors</a></li>
              <li><a href="#">Smart Pots</a></li>
              <li><a href="#">Data Analytics</a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4 className="column-heading">Company</h4>
            <ul className="link-list">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="link-column">
            <h4 className="column-heading">Support</h4>
            <ul className="link-list">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          © 2025 Smart Harvest. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
