// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import PlantCard from '../../components/PlantCard/PlantCard';
import PlantImageSelector from '../../components/PlantImageSelector/PlantImageSelector';
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { auth_test } from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [plants, setPlants] = useState([
    {
      id: 1,
      plantName: "Monstera Deliciosa",
      imageUrl: "../src/assets/plant1.png",
      addedDate: "2025-03-13",
      careDetails: {
        water: "weekly",
        sunlight: "medium",
        notes: "Keep soil slightly moist"
      }
    }
  ]);

  useEffect(() => {
    // Authentication check
    auth_test().then(result => {
      if (!result) {
        navigate("/sign-in"); // Fixed the route to match your App.js
      }
    }).catch(error => {
      console.error("Authentication error:", error);
    });
  }, [navigate]);

  useEffect(() => {
    // Modal handling
    if (isSelectorOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isSelectorOpen]);

  const handleAddPlantClick = () => {
    setIsSelectorOpen(true);
  };

  const handleAddNewPlant = (plantData) => {
    const newPlant = {
      id: plants.length + 1,
      plantName: plantData.name,
      imageUrl: plantData.imageUrl,
      addedDate: new Date().toISOString().split('T')[0],
      careDetails: {
        water: plantData.waterFrequency,
        sunlight: plantData.sunlight,
        notes: plantData.notes
      }
    };
    setPlants([...plants, newPlant]);
    setIsSelectorOpen(false);
  };

  return (
    <div className="dashboard-container">
      <DashboardSlider />
      
      <div className="plants-grid-container">
        <div className="plants-container">
          {plants.map(plant => (
            <PlantCard 
              key={plant.id}
              plantName={plant.plantName}
              imageUrl={plant.imageUrl}
              addedDate={plant.addedDate}
            />
          ))}
          
          <div className="plant-card add-button" onClick={handleAddPlantClick}>
            <div className="add-button-content">
              <span className="plus-sign">+</span>
            </div>
          </div>
        </div>
      </div>

      {isSelectorOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PlantImageSelector 
              onClose={() => setIsSelectorOpen(false)}
              onImageSelect={handleAddNewPlant}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;