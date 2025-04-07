import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import '../SignIn/SignIn.css';

async function createClientAccount(nom, prenom, tel, email, password) {
  try {
    const response = await fetch('http://localhost:3500/api/register/compte/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      },
      credentials: 'include',
      body: JSON.stringify({
        nom: nom,
        prenom: prenom,
        tel: tel,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la création du compte client');
    }

    console.log('Compte client créé avec succès:', data.compte);
    return data.compte;
  } catch (error) {
    console.error('Erreur:', error.message);
    throw error;
  }
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const compte = await createClientAccount(
        formData.username,
        formData.username,
        formData.phone,
        formData.email,
        formData.password
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <br /><br /><br /><br />
      <div className="auth-header">
        <h1>Sign up to add user</h1>
        <p className="auth-subheader">
          Or{' '}
          <a href="/signin" className="signup-link">
            sign in to your existing account
          </a>
        </p>
      </div>

      <div className="signin-card">
        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className={errors.agreeTerms ? 'error' : ''}
              />
              I agree to the terms and conditions
              {errors.agreeTerms && (
                <span className="error-message">{errors.agreeTerms}</span>
              )}
            </label>
          </div>

          <button 
            type="submit" 
            className="signin-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
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
      <br /><br /><br />
    </div>
  );
};

export default SignUp;