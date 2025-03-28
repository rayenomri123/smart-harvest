// detectorsClient.js
const BASE_URL = 'http://192.168.1.16:8000/api'; // URL de votre serveur FastAPI

// Fonction générique pour gérer les requêtes fetch
async function fetchFromApi(endpoint,plant_id, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}?plant_id=${plant_id}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de l'appel à ${endpoint}:`, error);
        throw error;
    }
}

// Fonctions spécifiques pour chaque endpoint
export async function getSoilHumidity(plant_id) {
    return await fetchFromApi('/humidity_sol',plant_id, {
        method: 'GET'
    });
}

export async function getLuminosity(plant_id) {
    return await fetchFromApi('/ldr',plant_id, {
        method: 'GET'
    });
}

export async function getDistance(plant_id) {
    return await fetchFromApi('/distance',plant_id, {
        method: 'GET'
    });
}

export async function getTempHumidity(plant_id) {
    return await fetchFromApi('/temp_humidity',plant_id, {
        method: 'GET'
    });
}


export async function controlRelay(plant_id,time) {
    await fetchFromApi('/relay',plant_id, {
        method: 'POST',
        body: JSON.stringify({ state : 1 })
    });
    
    await new Promise(resolve => {
        setTimeout(resolve, time);
    });

    await fetchFromApi('/relay',plant_id, {
        method: 'POST',
        body: JSON.stringify({ state : 0 })
    });
}
