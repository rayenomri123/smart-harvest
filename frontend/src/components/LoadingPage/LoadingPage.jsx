import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingPage;