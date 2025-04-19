import React from 'react';
import { FiTrash2, FiEdit3  } from 'react-icons/fi';
import { deletePlant} from '../../services/plantService';
import { useNavigate } from 'react-router-dom';
import './PlantCard.css';

const PlantCard = ({ plantName, imageUrl, date, mode, id}) => {
  const navigate = useNavigate();
  function convertirMsEnDate(chaineMs) {
    const ms = parseInt(chaineMs, 10); // Conversion en nombre
    const date = new Date(ms); // Création de l'objet Date

    const annee = date.getUTCFullYear();
    const mois = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
    const jour = String(date.getUTCDate()).padStart(2, '0'); // Jour sur 2 chiffres

    return `${annee}/${mois}/${jour}`;

   
}

const handleDelete = (e) => {
  e.stopPropagation();
  if (window.confirm(`Are you sure you want to delete ${plantName}? This action cannot be undone.`)) {
    deletePlant(id);
    navigate('/dashboard');
  }
};

  return (
    <div className="plant-card-container">
      <div className="image-card-container">
        <img 
          src={imageUrl || '/placeholder-plant.jpg'}
          alt={plantName} 
          className="plant-image"
        />
        <div className="card-buttons">
          <button className="delete-button-card" onClick={handleDelete}>
            <FiTrash2 className="delete-icon-card" />
          </button>
          <button className="edit-button-card" >
            <FiEdit3  className="edit-icon-card" />
          </button>
        </div>
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