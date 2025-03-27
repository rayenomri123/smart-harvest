// detectorsClient.js
const BASE_URL = 'http://192.168.1.16:8000/api'; // URL de votre serveur FastAPI

// Fonction générique pour gérer les requêtes fetch
async function fetchFromApi(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
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
export async function getSoilHumidity() {
    return await fetchFromApi('/humidity_sol', {
        method: 'GET'
    });
}

export async function getLuminosity() {
    return await fetchFromApi('/ldr', {
        method: 'GET'
    });
}

export async function getDistance() {
    return await fetchFromApi('/distance', {
        method: 'GET'
    });
}

export async function getTempHumidity() {
    return await fetchFromApi('/temp_humidity', {
        method: 'GET'
    });
}

export async function controlRelay(state) {
    return await fetchFromApi('/relay', {
        method: 'POST',
        body: JSON.stringify({ state })
    });
}
