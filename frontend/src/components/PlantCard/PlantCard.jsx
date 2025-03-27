import React from 'react';
import './PlantCard.css';

const PlantCard = ({ plantName, imageUrl, addedDate }) => {
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="plant-card">
      <div className="image-container">
        <img 
          src={imageUrl || '/placeholder-plant.jpg'} 
          alt={plantName} 
          className="plant-image"
        />
      </div>
      <div className="plant-info">
        <h3 className="plant-name-card">{plantName}</h3>
      </div>
    </div>
  );
};

export default PlantCard;