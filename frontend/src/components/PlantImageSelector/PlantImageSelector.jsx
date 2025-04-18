
import React, { useState } from 'react';
import PlantFormModal from '../PlantFormModal/PlantFormModal.jsx';
import './PlantImageSelector.css';

const plantImages = [
  { id: 1, name: 'Lavandula', url: '../src/assets/plant1.png' },
  { id: 2, name: 'Snake Plant', url: '../src/assets/plant2.png' },
  { id: 3, name: 'Fiddle Leaf Fig', url: '../src/assets/plant3.png' },
  { id: 4, name: 'Golden Pothos', url: '../src/assets/plant4.png' },
  { id: 5, name: 'ZZ Plant', url: '../src/assets/plant5.png' },
  { id: 6, name: 'Peace Lily', url: '../src/assets/plant6.png' },
];

const PlantImageSelector = ({ onClose, onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      setShowFormModal(true);
    }
  };

  const handleFormSubmit = (formData) => {
    onImageSelect({
      ...formData,
      imageUrl: selectedImage
    });
    setShowFormModal(false);
    onClose();
  };

  return (
    <>
      <div className="plant-selector-content">
        <button className="modal-close-button" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="#5a5a5a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <h2 className="modal-title">Choose Your Plant</h2>
        <p className="modal-subtitle">Select from our collection</p>
        
        <div className="plant-grid">
          {plantImages.map((plant) => (
            <div 
              key={plant.id}
              className={`plant-image-card ${selectedImage === plant.url ? 'selected' : ''}`}
              onClick={() => handleImageClick(plant.url)}
            >
              <div className="plant-thumbnail-container">
                <img 
                  src={plant.url} 
                  alt={plant.name}
                  className="plant-thumbnail"
                  onError={(e) => {
                    e.target.src = '/fallback-plant.png';
                    e.target.onerror = null;
                  }}
                />
                {selectedImage === plant.url && (
                  <div className="checkmark">
                    <span className="check-icon">✓</span>
                  </div>
                )}
              </div>
              <p className="plant-name">{plant.name}</p>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button className="outline-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="primary-button" 
            onClick={handleConfirmSelection}
            disabled={!selectedImage}
          >
            Confirm Selection
          </button>
        </div>
      </div>

      {showFormModal && (
        <PlantFormModal 
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          selectedImage={selectedImage}
        />
      )}
    </>
  );
};

export default PlantImageSelector;