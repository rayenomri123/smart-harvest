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

//affichage de la table
async function displayTables(pool) {
    try {
      // Récupérer la liste des tables
      const [tables] = await pool.execute('SHOW TABLES');
      console.log('\nListe des tables :');
      tables.forEach(table => {
        console.log(`- ${Object.values(table)[0]}`);
      });
  
      // Pour chaque table, récupérer sa structure
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
        console.log(`\nStructure de la table "${tableName}":`);
        columns.forEach(column => {
          console.log(
            `  - ${column.Field}: ${column.Type} | Clé primaire: ${
              column.Key === 'PRI' ? 'Oui' : 'Non'
            } | Null: ${column.Null === 'YES' ? 'Autorisé' : 'Non autorisé'}`
          );
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'affichage des tables :', error.message);
    }
  }

//cretation des base de donner
async function initializeDatabase() {
    try {
      

        // Requêtes SQL pour créer les tables
        const rawData = fs.readFileSync('database/database.json', 'utf8'); // Lire le fichier en mode texte
        const data = JSON.parse(rawData); // Convertir le JSON en objet JavaScript

        //delete all tables
        // await pool.execute(data.deleteUserTables);
        // await pool.execute(data.deletePlantTable);

        // Exécuter les requêtes SQL
        await pool.execute(data.createCompteTable);
        await pool.execute(data.createAdminTable);
        await pool.execute(data.createClientTable);
        await pool.execute(data.createRefreshTokensTable);

        await pool.execute(data.createPlantTable);
        await pool.execute(data.createSensorTypeTable);
        await pool.execute(data.createPinTable);
        await pool.execute(data.createPinPlantTable);
        await pool.execute(data.createValueTable);

        // await pool.execute(data.createSettingsTable);//mode (auto,manu),reservoirMin,reservoir

        //add admin user

        // password = await bcrypt.hash("admin", 10);
        // const [result] = await pool.execute(`INSERT INTO Compte (adresse_email, mot_de_passe, numero_tel, nom, prenom) VALUES ('admin', '${password}', 'admin', 'admin', 'admin');`);
        // await pool.execute("INSERT INTO Compte_Admin (id_compte) VALUES (?);", [result.insertId]);

        //add sensors

        // await pool.execute(`INSERT INTO SensorType (nom) VALUES ('humidite sol'), ('humidite air'), ('luminosite'), ('pompe a eau'), ('ultra son');`);


        // await displayTables(pool);//afficher la base de donner
        
        // const [table] = await pool.execute('select * from Compte;');
        // table.forEach(element => {console.log(element);});

        // console.log("compte client");
        // const [tables] = await pool.execute('select * from Compte_Client;');
        // tables.forEach(element => {console.log(element);});

        // console.log("compte Admin");
        // const [tables2] = await pool.execute('select * from Compte_Admin;');
        // tables2.forEach(element => {console.log(element);});
        
        console.log('Base de données initialisée avec succès.');
        } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données :', error.message);
    };
}




module.exports = {pool,initializeDatabase};