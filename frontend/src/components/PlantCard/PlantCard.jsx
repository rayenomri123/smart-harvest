import React from 'react';
import './PlantCard.css';

const PlantCard = ({ plantName, imageUrl, date, mode, id}) => {
  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10); // Conversion en nombre
    const date = new Date(ms); // Création de l'objet Date

    const annee = date.getUTCFullYear();
    const mois = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
    const jour = String(date.getUTCDate()).padStart(2, '0'); // Jour sur 2 chiffres

    return `${annee}/${mois}/${jour}`;
}

  return (
    <div className="plant-card-container">
      <div className="image-card-container">
        <img 
          src={imageUrl || '/placeholder-plant.jpg'}
          alt={plantName} 
          className="plant-image"
        />
      </div>
      <div className="plant-info">
        <h3 className="plant-name-card">{plantName}</h3>
        <h3 className="plant-mode-card">{mode}</h3>
        <h3 className="plant-date-card">created : {convertirMsEnDate(date)}</h3>
      </div>
    </div>
  );
};

export default PlantCard;