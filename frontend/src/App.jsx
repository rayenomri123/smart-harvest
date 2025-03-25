import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth_test } from './services/authService';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import Home from './pages/Home/Home.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import SignIn from './pages/SignIn/SignIn.jsx';
import Footer from './components/Footer/Footer.jsx';
import SignUp from './pages/SignUp/SignUp.jsx';
import ContactUs from './pages/ContactUs/ContactUs.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import './App.css';

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
    return <div className="loading-spinner">Loading...</div>;
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
    return <div className="loading-spinner">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        
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
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
