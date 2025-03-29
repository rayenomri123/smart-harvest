import React from 'react';
import './PlantCard.css';

const PlantCard = ({ plantName, imageUrl, date, mode, id }) => {
  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10); // Conversion en nombre
    const date = new Date(ms); // Création de l'objet Date

    const annee = date.getUTCFullYear();
    const mois = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
    const jour = String(date.getUTCDate()).padStart(2, '0'); // Jour sur 2 chiffres

    return `${annee}/${mois}/${jour}`;
}
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
        <h3 className="plant-name-card">created : {convertirMsEnDate(date)}</h3>
        <h3 className="plant-name-card">{mode}</h3>
      </div>
    </div>
  );
};

export default PlantCard;