import React, { useState,useEffect, use } from 'react';
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
import {getLuminosity,controlRelay,getSensorsById,getSoilHumidity,getTempHumidity  } from '../../services/deteService';
import { FaGlassWater } from "react-icons/fa6";

const PlantProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant } = location.state || {};
  const chemin = window.location.pathname;
  const id_p = chemin.split('/')[1];
  const [currentMode, setCurrentMode] = useState(plant.mode || 'automatic');
  const [tankLevel] = useState(19);
  const [statuses, setStatuses] = useState([
    // { 
    //   type: 'moisture',
    //   value: 100,
    //   label: 'MOISTURE',
    //   note: 'Optimal moisture level'
    // },
    // {
    //   type: 'light',
    //   value: 50,
    //   label: 'LIGHT',
    //   note: 'Moderate light needed'
    // },
    // {
    //   type: 'ph',
    //   value: 20,
    //   label: 'PH',
    //   note: 'Acidic level critical'
    // },
    // {
    //   type: 'tank',
    //   value: 0,
    //   label: 'TANK',
    //   note: 'Emergency refill required'
    // }
  ]);


  const getTankStatus = (level) => {
    if (level === 0) return 'empty';
    if (level > 0 && level < 20) return 'low';
    if (level >= 20 && level < 50) return 'medium';
    return 'good';
  };

  const getSensorData = async (sensorId,type=1) => {
    try {
      switch(sensorId) {
        case 'humidite sol':
          const res1 = await getSoilHumidity(id_p);
          return res1.humiditer_sol.toString().split(".")[0];
        case 'humidite air':
          const res2 = await getTempHumidity(id_p);
          return res2.humidity
          case 'temperature':
            const res5 = await getTempHumidity(id_p);
            return res5.temp
        case 'luminosite':
          const res3 = await getLuminosity(id_p);
          return res3.Luminosite.toString().split(".")[0];
        case 'ultra son':
          const res4 = await getDistance(id_p);
          return res4.distance
        // case 'pompe a eau':
        //   return await controlRelay(id_p);
        default:
          return null;
      }
    } catch (error) {
      return "20";
    }
  };
  useEffect(() => {
    // setCurrentMode (changeMode(id_p))
    changeMode(id_p).then(res=> setCurrentMode(res))
  }, [])
  
  // controlRelay(id_p,1000).then(result => console.log(result));

  const updateAllSensors = async () => {
    try {
      const sensors = await getSensorsById(id_p);
      

      const humiditeAirSensor = sensors.find(sensor => sensor.nom === "humidite air");
      const idSensorTypeHumiditeAir = humiditeAirSensor?.id_sensor_type;

      // Vérification + ajout conditionnel
      const shouldAddPump = !!humiditeAirSensor; // Convertit en booléen

      if (shouldAddPump) {
        sensors.push({ id_sensor_type: idSensorTypeHumiditeAir, nom: "temperature" }); // Modifie le tableau directement
      }
      
      const updatedStatuses = await Promise.all(
        sensors.filter(sensor => sensor.nom !== 'pompe a eau').map(async (sensor) => {
            const value = await getSensorData(sensor.nom);
            return {
              type: sensor.nom,
              value: value,
              label: sensor.nom.toUpperCase(),
              note: '' // Vous pouvez ajouter une logique pour générer des notes
            };
          
        })
      );
      
      setStatuses(updatedStatuses);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour des capteurs:", error);
      
    }
  };
  
  useEffect(() => {
    updateAllSensors(); // Première exécution
    
    const interval = setInterval(() => {
      updateAllSensors();
    }, 1000); // Toutes les 10 secondes

    return () => clearInterval(interval); // Nettoyage
  }, [id_p]);


  const getStatus = (value) => {
    if (value >= 50) return 'good';
    if (value >= 20 && value < 49) return 'medium';
    if (value >= 1 && value < 19) return 'low';
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
    try {
      controlRelay(id_p,1*1000).then(result => console.log(result));//change value*1000 with value/(ml/second)*1000
    } catch (error) {
      console.error(error);
    }
  }
  

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
      <button 
        className="watering-button" 
        onClick={handleWater}
        disabled={currentMode === 'automatic'}
      >
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
        
        <div className="tank-indicator horizontal">
          <FaGlassWater className={`tank-icon ${getTankStatus(tankLevel)}`} />
          <div className="tank-progress-container">
          <div className="tank-progress">
    <div 
      className={`tank-fill ${getTankStatus(tankLevel)}`}
      style={{ width: `${tankLevel}%` }}
    />
  </div>
  <div className={`tank-percentage ${tankLevel < 50 ? 'dark' : ''}`}>
    {tankLevel}%
  </div>
          </div>
        </div>
        
      </div>
      
      <button className="delete-button" onClick={handleDelete}>
          <FaTrash className="button-icon" />
          DELETE
        </button>
    </div>
  );
};

export default PlantProfile;