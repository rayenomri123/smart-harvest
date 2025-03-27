// src/pages/PlantProfile/PlantProfile.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './PlantProfile.css';
import {getLuminosity} from '../../services/deteService';

const PlantProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant } = location.state || {};
  getLuminosity().then(result => console.log(result));//need to send plant id
  // Sample status data structure (update according to your API)
  const statuses = [
    { 
      type: 'moisture',
      value: 60,
      status: 'good',
      label: 'MOISTURE',
      note: ''
    },
    {
      type: 'light',
      value: 60,
      status: 'low',
      label: 'LIGHT',
      note: 'take it to sunlight'
    },
    {
      type: 'ph',
      value: 60,
      status: 'good',
      label: 'PH',
      note: 'add the compliments'
    },
    {
      type: 'tank',
      value: 60,
      status: 'low',
      label: 'TANK',
      note: 'add water to the tank'
    }
  ];

  if (!plant) {
    return <div className='dashboard-container'><DashboardSlider /><p>Please select a plant.</p></div>;
  }

  const handleDelete = () => {
    alert(`Deleting plant: ${plant.plantName}`);
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container plant-profile-container">
      <DashboardSlider />
      
      <div className="plant-profile-content">
        <div className="plant-profile-left">
          <img
            src={plant.imageUrl || '/placeholder-plant.jpg'}
            alt={plant.plantName}
            className="plant-profile-image"
          />
          <h2 className="plant-profile-name">{plant.plantName}</h2>
        </div>

        <div className="plant-profile-right">
          <div className="plant-status-container">
            {statuses.map((status, index) => (
              <div className="plant-status-item" key={index}>
                <div className='P1'>
                    <div className={`status-percentage ${status.status}`}>
                    {status.value}%
                    </div>
                    
                </div >
        
                <div className='P2'>
                <div className="status-label">
                    <span className={`status-icon ${status.status}`}>
                        {status.status === 'good' ? '✔ ' : '✖ '}
                    </span>
                    {status.label}
                    </div>
                    {status.note && <div className="status-note">{status.note}</div>}
                </div>
                
                
              </div>
            ))}
          </div>
        </div>
      </div>

      

      <div className="plant-profile-buttons">
        <button className="manual-button">MANUAL</button>
        <button className="automatic-button">AUTOMATIC</button>
        <button className="delete-button" onClick={handleDelete}>
        DELETE
      </button>
      </div>

      
    </div>
  );
};

export default PlantProfile;