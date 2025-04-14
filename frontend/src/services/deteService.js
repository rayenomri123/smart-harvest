// detectorsClient.js
const BASE_URL = 'http://192.168.235.39:8000/api'; // URL de votre serveur FastAPI

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

export async function getSensorsById(id_plant) {
    try {
        const response = await fetch("http://localhost:3500/api/plants/get_sensors_id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({
            id_plant:id_plant
          }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Token refresh error:", error);
        return false;
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

export async function getDistance() {
    return await fetchFromApi('/distance',0, {
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
