import React from 'react';
import './ProfilePage.css';
import { FaSave, FaTrashAlt} from 'react-icons/fa';

const ProfilePage = () => {
  return (
    <div className="profile-settings-container">
      <div className="profile-settings-card">
        <div className="profile-settings-header">
          <h1>Profile Settings</h1>
          <div className="profile-settings-image">
            <span className="profile-initials">JD</span>
          </div>
        </div>

        <form className="profile-settings-form">
          <div className="settings-form-grid">
            <div className="settings-input-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Rayen"
                className="settings-form-input"
              />
            </div>

            <div className="settings-input-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Omri"
                className="settings-form-input"
              />
            </div>

            <div className="settings-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="rayenomri23p@gmail.com"
                className="settings-form-input"
              />
            </div>

            <div className="settings-input-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="90 065 188"
                className="settings-form-input"
              />
            </div>

            <div className="settings-input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="settings-form-input"
              />
            </div>
          </div>

          <div className="button-group">
          <button type="button" className="settings-delete-button">
              <FaTrashAlt className="button-icon" /> Delete Account
            </button>
            <button type="submit" className="settings-save-button">
              <FaSave className="button-icon" /> Save Changes
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;