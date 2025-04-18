import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaTint, 
  FaTrash, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaSkullCrossbones
} from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';
import { GiPlantWatering, GiAutoRepair } from "react-icons/gi";
import DashboardSlider from '../../components/DashboardSlider/DashboardSlider';
import './PlantProfile.css';
import { deletePlant, changeMode,getHistory } from '../../services/plantService';
import { getLuminosity, controlRelay, getSensorsById, getSoilHumidity, getTempHumidity, getDistance } from '../../services/deteService';
import LineChart from '../../components/LineChartComponent/LineChartComponent';

const PlantProfile = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const storedPlantString = localStorage.getItem('selectedPlant');
  const storedPlant = storedPlantString ? JSON.parse(storedPlantString) : null;
  const plant = location.state?.plant || storedPlant;

  const chemin = window.location.pathname;
  const id_p = chemin.split('/')[1];
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMode, setCurrentMode] = useState(plant?.mode || 'automatic');
  const [tankLevel, setTankLevel] = useState(0);
  const [pumpWorking, setPumpWorking] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [xData, setXData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [xData2, setXData2] = useState([]);
  const [seriesData2, setSeriesData2] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const [x, series] = await getHistory(id_p, 'humidite sol');
        setXData(x);
        setSeriesData(series);
        const [x2, series2] = await getHistory(id_p, 'luminosite');
        setXData2(x2);
        setSeriesData2(series2);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    }

    fetchHistory();
  });

  const getTankStatus = (level) => {
    if (level === 0) return 'empty';
    if (level > 0 && level <= 25) return 'low';
    if (level > 25 && level <= 50) return 'medium';
    return 'good';
  };

  const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
  
  const getSensorData = async (sensorId, type = 1) => {
    try {
      switch (sensorId) {
        case 'humidite sol':
          const res1 = await getSoilHumidity(id_p);
          return { "aff": res1.humiditer_sol.toString().split(".")[0] + "%", "val": res1.humiditer_sol };
        case 'humidite air':
          const res2 = await getTempHumidity(id_p);
          return { "aff": res2.humidity.toString() + "%", "val": res2.humidity };
        case 'temperature':
          const res5 = await getTempHumidity(id_p);
          return { "aff": res5.temp.toString() + "°c", "val": res5.temp };
        case 'luminosite':
          const res3 = await getLuminosity(id_p);
          return { "aff": res3.Luminosite.toString().split(".")[0] + "%", "val": res3.Luminosite.toString().split(".")[0] };
        case 'ultra son':
          const res4 = await getDistance();
          return Number(res4.distance);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return "20";
    }
  };
  useEffect(() => {
    changeMode(id_p).then(res => setCurrentMode(res));
  }, [id_p]);

  const updateAllSensors = async () => {
    try {
      const sensors = await getSensorsById(id_p);
      const humiditeAirSensor = sensors.find(sensor => sensor.nom === "humidite air");
      const idSensorTypeHumiditeAir = humiditeAirSensor?.id_sensor_type;

      // If there's a humidite air sensor, add the temperature sensor.
      if (humiditeAirSensor) {
        sensors.push({ id_sensor_type: idSensorTypeHumiditeAir, nom: "temperature" });
      }

      const updatedStatuses = await Promise.all(
        sensors.filter(sensor => sensor.nom !== 'pompe a eau').map(async (sensor) => {
          const value = await getSensorData(sensor.nom);
          return {
            type: sensor.nom,
            value: value,
            label: sensor.nom.toUpperCase(),
            note: ''
          };
        })
      );

      setTankLevel(await getSensorData("ultra son"));
      setStatuses(updatedStatuses);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des capteurs:", error);
    }
  };

  useEffect(() => {
    updateAllSensors();
    const interval = setInterval(() => {
      updateAllSensors();
    }, 1000);
    return () => clearInterval(interval);
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

  const handleWater = async (volume) => {
    if (pumpWorking) return;
    setPumpWorking(true);
    try {
      const duration = volume * 40; // 25mL = 1s (1000ms)
      await controlRelay(id_p, duration);
    } catch (error) {
      console.error(error);
    } finally {
      setPumpWorking(false);
      setShowDropdown(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${plant.nom}? This action cannot be undone.`)) {
      deletePlant(id_p);
      navigate('/dashboard');
    }
  };

  if (!plant) {
    return (
      <div className='dashboard-container'>
        <DashboardSlider />
        <p>Please select a plant.</p>
      </div>
    );
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
              const currentStatus = getStatus(status.value.val);
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
                      {status.value.aff}
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
      <div className="watering-container" ref={dropdownRef}>
  <button 
    className="watering-button" 
    onClick={() => setShowDropdown(!showDropdown)}
    disabled={currentMode === 'automatic' || pumpWorking}
  >
    <FaTint className="button-icon" />
    {pumpWorking ? 'WATERING...' : 'WATERING'}
  </button>
  
  {showDropdown && (
    <div className="dropdown-menu">
      {[25, 50, 75, 100].map((volume) => (
        <div
          key={volume}
          className="dropdown-item"
          onClick={() => handleWater(volume)}
        >
          {volume} mL
        </div>
      ))}
    </div>
  )}
</div>
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
      <div className="charts-container">
  <LineChart 
    title="Soil Humidity History"
    
    xData={xData}
    seriesData={seriesData}
  />
  <LineChart 
    title="Luminosity History"
    xData={xData2}
    seriesData={seriesData2}
  />
</div>
    </div>
  );
};

export default PlantProfile;