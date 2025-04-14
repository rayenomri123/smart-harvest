// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth_test } from './services/authService';
import LandingPage from './pages/LandingPage/LandingPage.jsx';

import Navbar from './components/Navbar/Navbar.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Footer from './components/Footer/Footer.jsx';
import SignUp from './pages/SignUp/SignUp.jsx';
import ContactUs from './pages/ContactUs/ContactUs.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import LoadingPage from './components/LoadingPage/LoadingPage.jsx';
import PlantProfile from './pages/PlantProfile/PlantProfile.jsx';
import About from './pages/About/About.jsx';
import './App.css';
import NotificationPage from './pages/NotificatonsPage/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await auth_test();
        setIsAuthenticated(!!result);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

const PublicRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await auth_test();
        setIsAuthenticated(!!result);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      
        
        <Route 
          path="/about" 
          element={
              <About />
          } 
        />

        <Route 
          path="/profile" 
          element={
              <ProfilePage />
          } 
        />  
        
        <Route 
          path="/sign-in" 
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          } 
        />
        
        {/* Signup route now uses ProtectedRoute */}
        <Route 
          path="/sign-up" 
          element={
            <ProtectedRoute>
              <SignUp />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/contact" element={<ContactUs />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/:id/plant-profile" 
          element={
            <ProtectedRoute>
              <PlantProfile />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
