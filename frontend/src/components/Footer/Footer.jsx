import React from 'react'
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="brand-section">
          <h2 className="logo">SMART HARVEST</h2>
          <p className="tagline">Smart Harvest tracks soil moisture, temperature, and sunlight to optimize irrigation and boost plant health.</p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://github.com" aria-label="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        <div className="links-section">
          {/* ... (keep existing link columns the same) ... */}
        </div>
      </div>

      <div className="copyright">
        © 2025 Smart Harvest. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer