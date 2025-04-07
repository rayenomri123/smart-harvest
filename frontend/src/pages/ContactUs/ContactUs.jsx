import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p className="contact-subheader">We'd love to hear from you!</p>
        </div>

        <div className="contact-content">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className='formLabel'>Your Name</label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className='formLabel'>Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className='formLabel'>Message</label>
              <textarea
                id="message"
                placeholder="Type your message here..."
                className="form-textarea"
                rows="5"
              ></textarea>
            </div>

            <button type="submit" className="contact-button">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h3>Visit Us</h3>
                <p>123 Green Valley Road<br/>Eco City, EC 45678</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhone className="info-icon" />
              <div>
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567<br/>Mon-Fri, 9am-5pm EST</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h3>Email Us</h3>
                <p>support@smartharvest.com<br/>response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;