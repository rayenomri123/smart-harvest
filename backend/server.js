//we shoul use express.static on the end of the project (need static frontend(buid version)) utilite : séparant les ressources statiques du code backend

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require  ('./middleware/log');
const errorHandler = require('./middleware/errorHandler');
const {pool,initializeDatabase} = require('./database/connect');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
require('dotenv').config();


const port = process.env.PORT || process.env.PORT_SERVEUR;
//"npm run build" pour cree le dossier 'dist' dans le frontend

//"npm run dev" pour le mode devlpement // a chaque modification du code node restart


// Middleware pour parser les requêtes JSON
app.use(express.json()); // Pour parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les requêtes form-urlencoded

//custom middleware logger and errorHandler
app.use(logger);
app.use(errorHandler);
app.use(cookieParser());
//cross origin resource sharing
app.use(cors(require('./config/corsConfig'))); //for api from externel websites

//api
app.use('/api/register', require('./routes/register'));
app.use('/api/Login', require('./routes/auth'));//authentification
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/logout', require('./routes/logout'));

app.use(verifyJWT);

app.use('/api/notif', require('./routes/notif'));
app.use('/api/plants', require('./routes/plants'));
app.use('/api/user', require('./routes/user'));

//test jwt with console.log
app.use('/api/test', require('./routes/test'));



//the routes
app.use('/',require('./routes/mainRoute'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    initializeDatabase();
});

// Gérer la fermeture du pool MySQL proprement à l'arrêt du serveur
process.on('SIGINT', async () => {
    console.log("Arrêt du serveur détecté... Fermeture du pool MySQL.");
    try {
        await pool.end();  // Ferme proprement toutes les connexions
        console.log("Pool MySQL fermé proprement.");
    } catch (error) {
        console.error("Erreur lors de la fermeture du pool MySQL :", error);
    }
    process.exit(0);
});