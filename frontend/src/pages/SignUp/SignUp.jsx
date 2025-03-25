import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaFacebook } from 'react-icons/fa';
import '../SignIn/SignIn.css';


async function createClientAccount(nom, prenom, tel, email, password) {
  try {
      const response = await fetch('http://localhost:3500/api/register/compte/client', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}` // Token JWT pour verifyRoles
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

function createClientSync(data) {
  createClientAccount(data.username, data.username, data.phone, data.email, data.password)
      .then((compte) => {
          // Fais quelque chose avec le résultat ici
          return compte; // Note : ceci ne sera pas retourné de manière synchrone
      })
      .catch((error) => {
          console.error('Erreur:', error.message);
          throw error; // Ou gère l'erreur différemment
      });
}

const SignUp = () => {
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
      // Here you would typically send the data to your backend
      // For demonstration, we'll just log it and simulate an API call
      
      createClientSync(formData,
        (error, compte) => {
        if (error) {
            console.error('Erreur:', error.message);
        } else {
            console.log('Compte créé:', compte);
        }
    })
      
      // Simulate API call


      // Reset form after successful submission
      // setFormData({
      //   username: '',
      //   email: '',
      //   phone: '',
      //   password: '',
      //   confirmPassword: '',
      //   agreeTerms: false
      // });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Sign up for free</h2>
          <p>
            Or{' '}
            <a href="/signin" className="signup-link">
              sign in to your existing account
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <div className="form-content">
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
              <label htmlFor="confirmPassword">Password confirmation</label>
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
                By signing up, you agree to our terms of use.
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
          </div>
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

export default SignUp;
