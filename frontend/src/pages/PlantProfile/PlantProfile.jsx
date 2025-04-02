// src/pages/PlantProfile/PlantProfile.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTint, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { GiPlantWatering, GiAutoRepair } from "react-icons/gi";
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './PlantProfile.css';
// import {
//   getLuminosity,
//   controlRelay,
//   getSensorsById,
//   getSoilHumidity,
//   getTempHumidity
// } from '../../services/deteService';
import { deletePlant, changeMode } from '../../services/plantService';

const PlantProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant } = location.state || {};
  const chemin = window.location.pathname;
  const id_p = chemin.split('/')[1];
  const [currentMode, setCurrentMode] = useState(plant?.mode || 'automatic');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [statuses] = useState([ // Remove setStatuses since we're using static data
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
  ]);

  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10);
    const date = new Date(ms);
    return `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  // COMMENTED OUT DATA FETCHING FUNCTIONS
  // const getSensorData = async (sensorId) => {
  //   try {
  //     switch(sensorId) {
  //       case 'humidite sol':
  //         const res1 = await getSoilHumidity(id_p);
  //         return res1.humiditer_sol.toString().split(".")[0];
  //       case 'humidite air':
  //         const res2 = await getTempHumidity(id_p);
  //         return res2.humidity;
  //       case 'temperature':
  //         const res5 = await getTempHumidity(id_p);
  //         return res5.temp;
  //       case 'luminosite':
  //         const res3 = await getLuminosity(id_p);
  //         return res3.Luminosite.toString().split(".")[0];
  //       case 'ultra son':
  //         const res4 = await getDistance(id_p);
  //         return res4.distance;
  //       default:
  //         return null;
  //     }
  //   } catch (error) {
  //     return "20";
  //   }
  // };

  // const determineStatus = (type, value) => {
  //   if (type === 'light') return value > 50 ? 'good' : 'low';
  //   return 'good';
  // };

  // COMMENTED OUT DATA UPDATING LOGIC
  // const updateAllSensors = async () => {
  //   try {
  //     const sensors = await getSensorsById(id_p);
  //     const humiditeAirSensor = sensors.find(sensor => sensor.nom === "humidite air");
      
  //     if (humiditeAirSensor) {
  //       sensors.push({ id_sensor_type: humiditeAirSensor.id_sensor_type, nom: "temperature" });
  //     }
      
  //     const updatedStatuses = await Promise.all(
  //       sensors.filter(sensor => sensor.nom !== 'pompe a eau').map(async (sensor) => ({
  //         type: sensor.nom,
  //         value: await getSensorData(sensor.nom),
  //         status: determineStatus(sensor.nom, await getSensorData(sensor.nom)),
  //         label: sensor.nom.toUpperCase(),
  //         note: ''
  //       }))
  //     );
      
  //     setStatuses(updatedStatuses);
  //   } catch (error) {
  //     console.error("Erreur lors de la mise à jour des capteurs:", error);
  //   }
  // };

  // COMMENTED OUT USE EFFECT FOR UPDATES
  // useEffect(() => {
  //   updateAllSensors();
  //   const interval = setInterval(updateAllSensors, 1000000);
  //   return () => clearInterval(interval);
  // }, [id_p]);

  const handleAutomatic = (newMode) => {
    if (currentMode === newMode) return;
    changeMode(id_p, newMode, 1)
      .then(() => setCurrentMode(newMode))
      .catch(error => console.error('Error changing mode:', error));
  };  

  const handleWater = (value) => {
    // controlRelay(id_p, value*1000)
    //   .then(result => console.log(result))
    //   .catch(error => console.error(error));
    console.log('Watering button clicked'); // Temporary log for styling
  };

  const confirmDelete = () => {
    deletePlant(id_p);
    navigate('/dashboard');
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
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
          <h2 className="plant-profile-date">{convertirMsEnDate(plant.date)}</h2>
        </div>

        <div className="plant-profile-right">
          <div className="plant-status-container">
            {statuses.map((status, index) => (
              <div className="plant-status-item" key={index}>
                <div className='P1'>
                  <div className={`status-percentage ${status.status}`}>
                    {status.value}%
                  </div>
                </div>
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
        <button className="watering-button" onClick={() => handleWater(10)}>
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

        <button className="delete-button" onClick={() => setShowDeleteConfirmation(true)}>
          <FaTrash className="button-icon" />
          DELETE
        </button>

        {showDeleteConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Delete Plant?</h3>
              <p>Are you sure you want to delete {plant.nom}? This action cannot be undone.</p>
              <div className="confirmation-buttons">
                <button className="confirm-button" onClick={confirmDelete}>
                  Delete
                </button>
                <button className="cancel-button" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantProfile;