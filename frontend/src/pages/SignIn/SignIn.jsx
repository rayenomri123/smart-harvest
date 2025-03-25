// Import necessary React modules and icons
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  // Navigation hook for redirecting after successful login
  const navigate = useNavigate();

  // State management for form data and validation
  const [formData, setFormData] = useState({
    email: '',
    pwd: '',          // Password field
    rememberMe: false // Remember me checkbox
  });

  const [errors, setErrors] = useState({});         // Validation errors storage
  const [isSubmitting, setIsSubmitting] = useState(false); // Form submission state

  // Unified input handler for all form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    
    // Password validation
    if (!formData.pwd) {
      newErrors.pwd = 'Password is required';
    } else if (formData.pwd.length < 4) {  // Note: Message says 6 characters but code checks for 4
      newErrors.pwd = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if validation fails
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // API call to backend authentication endpoint
      const response = await fetch("http://localhost:3500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Required for cookies/session management
        body: JSON.stringify(formData),
      });

      // Handle non-successful responses
      if (!response.ok) {
        const errorData = await response.json();
        // setErrorMessage(errorData.error || "Invalid credentials"); // Note: setErrorMessage is not defined
        return;
      }

      // Handle successful login
      const result = await response.json();
      localStorage.setItem("token", result.accessToken); // Store JWT token
      navigate("/dashboard"); // Redirect to dashboard

    } catch (error) {
      // Handle network errors
      console.error("Login error:", error);
      // setErrorMessage("Connection error"); // Note: setErrorMessage is not defined
    } finally {
      setIsSubmitting(false);
    }
  };

  // Component render structure
  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Sign in to your account</h2>
          <p>
            Or{' '}
            <a href="/signup" className="signup-link">
              sign up for a new account
            </a>
          </p>
        </div>

        {/* Main login form */}
        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          {/* Email input field */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password input field */}
          <div className="form-group">
            <label htmlFor="pwd">Password</label>
            <input
              type="password"  // Fixed from 'pwd' to 'password' for proper input masking
              id="pwd"
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
              required
              className={errors.pwd ? 'error' : ''}
            />
            {errors.pwd && <span className="error-message">{errors.pwd}</span>}
          </div>

          {/* Form options section */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-pwd">
              Forgot your password?
            </a>
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="signin-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Social authentication section */}
        <div className="social-auth">
          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-button google">
              <FcGoogle className="social-icon" />
              Google
            </button>
            <button type="button" className="social-button github">
              <FaGithub className="social-icon" />
              GitHub
            </button>
            <button type="button" className="social-button facebook">
              <FaFacebook className="social-icon" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;