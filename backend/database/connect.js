const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');
const fs = require('fs');
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DBPORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});



// Création des bases de données
async function initializeDatabase() {
    try {
        const rawData = fs.readFileSync('database/database.json', 'utf8');
        const data = JSON.parse(rawData);

        await pool.execute(data.createCompteTable);
        await pool.execute(data.createAdminTable);
        await pool.execute(data.createClientTable);
        await pool.execute(data.createRefreshTokensTable);
        await pool.execute(data.createPlantTable);
        await pool.execute(data.createSensorTypeTable);
        await pool.execute(data.createPinTable);
        await pool.execute(data.createPinPlantTable);
        await pool.execute(data.createValueTable);
        await pool.execute(data.createNotifTable);

        // Ajout de l'utilisateur admin
        // const password = await bcrypt.hash("admin", 10);
        // const [result] = await pool.execute(`INSERT INTO Compte (adresse_email, mot_de_passe, numero_tel, nom, prenom) VALUES ('admin', '${password}', 'admin', 'admin', 'admin');`);
        // await pool.execute("INSERT INTO Compte_Admin (id_compte) VALUES (?);", [result.insertId]);

        // Ajout des capteurs
        // await pool.execute(`INSERT INTO SensorType (nom) VALUES ('humidite sol'), ('humidite air'), ('luminosite'), ('pompe a eau'), ('ultra son');`);

        console.log('Base de données initialisée avec succès.');
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données :", error.message);
    }
}

module.exports = { pool, initializeDatabase };