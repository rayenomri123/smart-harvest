import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTint, 
  FaTrash, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaSkullCrossbones 
} from 'react-icons/fa';
import { GiPlantWatering, GiAutoRepair } from "react-icons/gi";
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './PlantProfile.css';
import { deletePlant, changeMode } from '../../services/plantService';

const PlantProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant } = location.state || {};
  const chemin = window.location.pathname;
  const id_p = chemin.split('/')[1];
  const [currentMode, setCurrentMode] = useState(plant?.mode || 'automatic');

  const [statuses] = useState([
    { 
      type: 'moisture',
      value: 100,
      label: 'MOISTURE',
      note: 'Optimal moisture level'
    },
    {
      type: 'light',
      value: 50,
      label: 'LIGHT',
      note: 'Moderate light needed'
    },
    {
      type: 'ph',
      value: 20,
      label: 'PH',
      note: 'Acidic level critical'
    },
    {
      type: 'tank',
      value: 0,
      label: 'TANK',
      note: 'Emergency refill required'
    }
  ]);

  const getStatus = (value) => {
    if (value === 100) return 'good';
    if (value >= 50) return 'medium';
    if (value >= 20) return 'low';
    return 'empty';
  };

  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10);
    const date = new Date(ms);
    return `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  const handleAutomatic = (newMode) => {
    if (currentMode === newMode) return;
    changeMode(id_p, newMode, 1)
      .then(() => setCurrentMode(newMode))
      .catch(error => console.error('Error changing mode:', error));
  };  

  const handleWater = () => {
    console.log('Watering button clicked');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${plant.nom}? This action cannot be undone.`)) {
      deletePlant(id_p);
      navigate('/dashboard');
    }
  };

  if (!plant) {
    return <div className='dashboard-container'><DashboardSlider /><p>Please select a plant.</p></div>;
  }

  return (
    <div className="dashboard-container plant-profile-container">
      <DashboardSlider />
      
      <div className="plant-profile-content">
        <div className="plant-profile-left">
          <img
            src={plant.url || '/placeholder-plant.jpg'}
            alt={plant.plantName}
            className="plant-profile-image"
          />
          <h2 className="plant-profile-name">{plant.nom}</h2>
          <h2 className="plant-profile-mode">{currentMode}</h2>
          <h2 className="plant-profile-date">created : {convertirMsEnDate(plant.date)}</h2>
        </div>

        <div className="plant-profile-right">
          <div className="plant-status-container">
            {statuses.map((status, index) => {
              const currentStatus = getStatus(status.value);
              const StatusIcon = {
                good: FaCheckCircle,
                medium: FaExclamationTriangle,
                low: FaTimesCircle,
                empty: FaSkullCrossbones
              }[currentStatus];

              return (
                <div className="plant-status-item" key={index}>
                  <div className='P1'>
                    <div className={`status-percentage ${currentStatus}`}>
                      {status.value}%
                    </div>
                  </div>
                  <div className='P2'>
                    <div className="status-label">
                      <StatusIcon className={`status-icon ${currentStatus}`} />
                      {status.label}
                    </div>
                    {status.note && <div className="status-note">{status.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="plant-profile-buttons">
        <button className="watering-button" onClick={handleWater}>
          <FaTint className="button-icon" />
          WATERING
        </button>

        <div className="toggle-container">
          <button 
            className={`toggle-option ${currentMode === 'automatic' ? 'active' : ''}`}
            onClick={() => handleAutomatic('automatic')}
          >
            <GiAutoRepair className="toggle-icon" />
            AUTOMATIC
          </button>
          <button 
            className={`toggle-option ${currentMode === 'manual' ? 'active' : ''}`}
            onClick={() => handleAutomatic('manual')}
          >
            <GiPlantWatering className="toggle-icon" />
            MANUAL
          </button>
          <div className={`toggle-slider ${currentMode}`}></div>
        </div>

        <button className="delete-button" onClick={handleDelete}>
          <FaTrash className="button-icon" />
          DELETE
        </button>
      </div>
    </div>
  );
};

export default PlantProfile;