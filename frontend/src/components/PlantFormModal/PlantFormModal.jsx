import React, { useState } from 'react';
import './PlantFormModal.css';

const PlantFormModal = ({ onClose, onSubmit, selectedImage }) => {
  const [plantData, setPlantData] = useState({
    name: '',
    mode: 'automatic',
    sensorCount: 1,
    sensors: Array(1).fill({ gpio: '', valueType: '' })
  });

  const gpioOptions = [
    'GPIO4', 'GPIO5', 'GPIO6', 'GPIO12', 'GPIO13', 
    'GPIO16', 'GPIO17', 'GPIO18', 'GPIO19', 'GPIO20',
    'GPIO21', 'GPIO22', 'GPIO23', 'GPIO24', 'GPIO25',
    'GPIO26', 'GPIO27', 'A0', 'A1', 'A2', 'A3'
  ];

  const valueTypeOptions = ['value1', 'value2', 'value3'];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...plantData,
      imageUrl: selectedImage
    });
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Configure Your Plant</h2>
        
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
                    {valueTypeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" className="outline-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlantFormModal;