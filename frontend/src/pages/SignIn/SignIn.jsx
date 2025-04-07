import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    pwd: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.pwd) {
      newErrors.pwd = 'Password is required';
    } else if (formData.pwd.length < 4) {
      newErrors.pwd = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return;
      }

      const result = await response.json();
      localStorage.setItem("token", result.accessToken);
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="auth-header">
        <h1>Sign in to your account</h1>
        <p className="auth-subheader">
          Or{' '}
          <a href="/signup" className="signup-link">
            sign up for a new account
          </a>
        </p>
      </div>

      <div className="signin-card">
        <form onSubmit={handleSubmit} className="signin-form" noValidate>
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

          <div className="form-group">
            <label htmlFor="pwd">Password</label>
            <input
              type="password"
              id="pwd"
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
              required
              className={errors.pwd ? 'error' : ''}
            />
            {errors.pwd && <span className="error-message">{errors.pwd}</span>}
          </div>

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

          <button 
            type="submit" 
            className="signin-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;