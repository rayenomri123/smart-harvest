import React, { useState, useEffect } from 'react';
import './PlantFormModal.css';
import { get_sensors } from '../../services/authService';

const PlantFormModal = ({ onClose, onSubmit, selectedImage }) => {
  const [plantData, setPlantData] = useState({
    name: '',
    mode: 'automatic',
    sensorCount: 1,
    sensors: Array(1).fill({ gpio: '', valueType: '' })
  });
  const [valueTypeOptions, setValueTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gpioOptions = [
    'GPIO4', 'GPIO5', 'GPIO6', 'GPIO12', 'GPIO13',
    'GPIO16', 'GPIO17', 'GPIO18', 'GPIO19', 'GPIO20',
    'GPIO21', 'GPIO22', 'GPIO23', 'GPIO24', 'GPIO25',
    'GPIO26', 'GPIO27', 'A0', 'A1', 'A2', 'A3'
  ];

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const data = await get_sensors();
        setValueTypeOptions(data.map(sensor => ({
          value: sensor.id_sensor_type,
          label: sensor.nom === "humidite air" 
      ? "humidite air et temperature" 
      : sensor.nom
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des capteurs:', error);
        setValueTypeOptions([
          { value: 2, label: 'humidite sol' },
          { value: 3, label: 'humidite air et temperature' },
          { value: 4, label: 'luminosite' },
          { value: 5, label: 'pompe a eau' },
          { value: 6, label: 'ultra son' }
        ]);
      }
    };
    fetchSensors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlantData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSensorCountChange = (e) => {
    const count = parseInt(e.target.value);
    setPlantData(prev => ({
      ...prev,
      sensorCount: count,
      sensors: Array(count).fill({ gpio: '', valueType: '' })
    }));
  };

  const handleSensorChange = (index, field, value) => {
    const updatedSensors = [...plantData.sensors];
    updatedSensors[index] = {
      ...updatedSensors[index],
      [field]: value
    };
    setPlantData(prev => ({
      ...prev,
      sensors: updatedSensors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Aucun token d\'authentification trouvé');
      setLoading(false);
      return;
    }

    try {
      // 1. Créer la plante
      const plantResponse = await fetch('http://localhost:3500/api/plants/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          nom: plantData.name,
          mode: plantData.mode,
          date:Date.now() 
        }),
      });

      if (!plantResponse.ok) {
        const errorData = await plantResponse.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la plante');
      }

      const plantDataResponse = await plantResponse.json();
      const plantId = plantDataResponse.insertId;

      // 2. Ajouter chaque capteur
      const sensorPromises = plantData.sensors.map(async (sensor, index) => {
        // Vérifier que valueType est défini
        if (!sensor.valueType) {
          throw new Error(`Le type de capteur n'est pas défini pour le capteur ${index + 1}`);
        }

        // Vérifier que valueType est une valeur valide (parmi les options)
        const selectedOption = valueTypeOptions.find(option => option.value === parseInt(sensor.valueType));
        if (!selectedOption) {
          throw new Error(`Type de capteur invalide pour le capteur ${index + 1}`);
        }

        return fetch(`http://localhost:3500/api/plants/${plantId}/addSensor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            id_pin: sensor.gpio,
            id_sensor_type: parseInt(sensor.valueType) // S'assurer que c'est un entier
          }),
        });
      });

      // Attendre que tous les capteurs soient ajoutés
      const sensorResponses = await Promise.all(sensorPromises);

      // Vérifier si toutes les requêtes ont réussi
      for (let i = 0; i < sensorResponses.length; i++) {
        if (!sensorResponses[i].ok) {
          const errorData = await sensorResponses[i].json();
          throw new Error(errorData.message || `Erreur lors de l'ajout du capteur ${i + 1}`);
        }
      }

      // Appeler onSubmit avec toutes les données si nécessaire
      onSubmit({
        ...plantData,
        imageUrl: selectedImage,
        plantId: plantId
      });

      // Fermer la modale
      onClose();

    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-content">
        <button className="close-button" onClick={onClose} disabled={loading}>×</button>
        <h2>Configure Your Plant</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-image-preview">
          <img src={selectedImage} alt="Selected plant" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group name-input">
            <label>Plant Name</label>
            <input
              type="text"
              name="name"
              value={plantData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mode-selector">
            <label>Operation Mode</label>
            <div className="mode-options">
              <button
                type="button"
                className={`mode-option ${plantData.mode === 'automatic' ? 'active' : ''}`}
                onClick={() => setPlantData({...plantData, mode: 'automatic'})}
              >
                Automatic
              </button>
              <button
                type="button"
                className={`mode-option ${plantData.mode === 'manual' ? 'active' : ''}`}
                onClick={() => setPlantData({...plantData, mode: 'manual'})}
              >
                Manual
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Number of Sensors</label>
            <select
              name="sensorCount"
              value={plantData.sensorCount}
              onChange={handleSensorCountChange}
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="sensors-container">
            {plantData.sensors.map((sensor, index) => (
              <div key={index} className="sensor-row">
                <div className="form-group">
                  <label>Sensor {index + 1} GPIO</label>
                  <select
                    value={sensor.gpio}
                    onChange={(e) => handleSensorChange(index, 'gpio', e.target.value)}
                    required
                  >
                    <option value="">Select GPIO</option>
                    {gpioOptions.map(gpio => (
                      <option key={gpio} value={gpio}>{gpio}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Value Type</label>
                  <select
                    value={sensor.valueType}
                    onChange={(e) => handleSensorChange(index, 'valueType', e.target.value)}
                    required
                  >
                    <option value="">Select Value Type</option>
                    {valueTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="outline-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantFormModal;