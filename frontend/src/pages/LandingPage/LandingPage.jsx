import React from 'react'
import './LandingPage.css'

const LandingPage = () => {
  return (
    <div className="landing-container">
        <div className="left-container">
            <img src="./src/assets/ldimg.png" alt="Plant monitoring illustration" />
        </div>
        <div className="right-container">
            <h1>Intelligent Plant Monitoring</h1>
            <p className="description">Smart Harvest tracks soil moisture, temperature, and sunlight to optimize irrigation and boost plant health. Stay connected for smarter, sustainable growth!</p>
        </div>
        <div className="cta-section">
            <p>"Join Smart Harvest today and revolutionize your plant care with intelligent monitoring. Optimize growth and sustainability with just a click!"</p>
            <button>Join Now</button>
        </div>
    </div>
  )
}

export default LandingPage