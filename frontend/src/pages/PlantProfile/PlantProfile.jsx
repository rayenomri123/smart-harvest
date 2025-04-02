// src/pages/PlantProfile/PlantProfile.jsx
import React,{useEffect,useState} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './PlantProfile.css';
import {getLuminosity,controlRelay,getSensorsById,getSoilHumidity,getTempHumidity  } from '../../services/deteService';
import {deletePlant,changeMode} from '../../services/plantService';
import { GiPlantWatering, GiAutoRepair } from "react-icons/gi";


const PlantProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant } = location.state || {};
  const chemin = window.location.pathname; // "/utilisateur/123"
  const id_p = chemin.split('/')[1];
  // const [statuses, setStatuses] = useState([]);
  const [currentMode, setCurrentMode] = useState(plant?.mode || 'automatic');


  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10); // Conversion en nombre
    const date = new Date(ms); // Création de l'objet Date

    const annee = date.getUTCFullYear();
    const mois = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
    const jour = String(date.getUTCDate()).padStart(2, '0'); // Jour sur 2 chiffres

    return `${annee}/${mois}/${jour}`;
}
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
  const determineStatus = (type, value) => {
    // Implémentez votre logique de statut ici
    // Exemple simplifié :
    if (type === 'light') {
      return value > 50 ? 'good' : 'low';
    }
    // Ajoutez d'autres conditions pour les autres types
    return 'good';
  };
  
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
              status: determineStatus(sensor.nom, value),
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
    }, 1000000); // Toutes les 10 secondes

    return () => clearInterval(interval); // Nettoyage
  }, [id_p]);

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

  const handleAutomatic = (newMode) => {
    if (currentMode === newMode) return;
    changeMode(id_p, newMode, 1)
      .then(() => {
        setCurrentMode(newMode);
      })
      .catch(error => {
        console.error('Error changing mode:', error);
      });
  };  

  const handleWater = (value) => {
    try {
      controlRelay(id_p,value*1000).then(result => console.log(result));//change value*1000 with value/(ml/second)*1000
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = () => {
    deletePlant(id_p);
    navigate('/dashboard'); 
  };

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
          <h2 className="plant-profile-mode">{plant.mode}</h2>
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
        <button className="watering-button" onClick={() => handleWater(10)}>WATERING</button>
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
          DELETE
        </button>
      </div>

      
    </div>
  );
};

export default PlantProfile; 