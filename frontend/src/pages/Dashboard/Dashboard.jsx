// In Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../../components/PlantCard/PlantCard';
import PlantImageSelector from '../../components/PlantImageSelector/PlantImageSelector';
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './Dashboard.css';
import { auth_test } from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [plants, setPlants] = useState([]); // Initialisé comme tableau vide
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
    const fetchPlants = async () => {
    try {
      // Récupérer le token (par exemple depuis localStorage)
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3500/api/plants/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Envoi du token dans l'en-tête
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Pour envoyer les cookies avec la requête
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des plantes');
      }

      const data = await response.json();
      
      setPlants(data); // Met à jour le state avec les données de l'API
    } catch (error) {
      console.error('Erreur:', error);
      // Optionnel : garder les données par défaut en cas d'erreur
      setPlants([{
        id: 1,
        plantName: "erreur plant",
        imageUrl: "../src/assets/plant1.png",
        mode: "unknew",
        date: Date.now()
      }]);
    }
  };

  fetchPlants();
}, []);

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

  const handleAddNewPlant = () => {
    location.reload();
    setIsSelectorOpen(false);
  };

  // New click handler to navigate with plant data
  const handlePlantClick = (plant) => {
    localStorage.setItem('selectedPlant', JSON.stringify(plant));
    navigate(`/${plant.id_plant}/plant-profile`, { state: { plant } });
  };

  return (
    <div className="dashboard-container">
      <DashboardSlider />
      
      <div className="plants-grid-container">
        <div className="plants-container">
          {plants.map(plant => (
            <div key={plant.id} onClick={() => handlePlantClick(plant)}>

              <PlantCard 
                plantName={plant.nom}
                imageUrl={plant.url}
                mode={plant.mode}
                id={plant.id_plant}
                date={plant.date}
              />
            </div>
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
