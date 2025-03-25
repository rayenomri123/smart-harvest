const {pool} = require('../database/connect');
const bcrypt = require('bcrypt');


function formatDateForMySQL(dateString) {
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`); 
    return date.toISOString().slice(0, 10); // Convertir en YYYY-MM-DD
}


// Fonction pour vérifier si un email ou un numéro de téléphone existe déjà
async function checkIfExists(email, numero_tel) {
    try {
        // Vérifier l'email
        const [emailRows] = await pool.execute('SELECT * FROM Compte WHERE adresse_email = ?', [email]);
        if (emailRows.length > 0) {
            return { exists: true, field: 'adresse_email' };
        }

        // Vérifier le numéro de téléphone
        const [phoneRows] = await pool.execute('SELECT * FROM Compte WHERE numero_tel = ?', [numero_tel]);
        if (phoneRows.length > 0) {
            return { exists: true, field: 'numero_tel' };
        }

        return { exists: false }; // Aucun doublon trouvé
    } catch (error) {
        throw error;
    }
}

// Fonction pour créer un compte Admin
createAdmin = async (req, res) => {
    try {
        const { nom, prenom, tel, email , password} = req.body;

        if (!nom || !prenom || !tel || !email||!password) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        const checkResult = await checkIfExists(email, tel);
        if (checkResult.exists) {
            return res.status(400).json({ error: 'email ou tel deja utiliser' });
        }

        //crypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        //insert data
        const [result] = await pool.execute(
            'INSERT INTO Compte (nom, prenom, numero_tel, adresse_email, mot_de_passe) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, tel, email,hashedPassword]
        );
        
        const insertId = result.insertId; //a ne pas supprimer

        const [result2] = await pool.execute(
            'INSERT INTO Compte_Admin (id_compte) VALUES (?)',
            [insertId]
        );

        const compte = { id_compte: result.id_compte, nom, prenom, tel, email};
        return res.status(201).json({compte});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du compte.' });
    }
}

// Fonction pour créer un compte client
createClient =  async (req, res) => {
    try {
        const { nom, prenom, tel, email , password} = req.body;

        if (!nom || !prenom || !tel || !email||!password) {
            return res.status(400).json({ error: 'Tous les champs sont requis.' });
        }

        const checkResult = await checkIfExists(email, tel);
        if (checkResult.exists) {
            return res.status(400).json({ error: 'email ou tel deja utiliser' });
        }

        //crypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        //insert data
        const [result] = await pool.execute(
            'INSERT INTO Compte (nom, prenom, numero_tel, adresse_email, mot_de_passe) VALUES (?, ?, ?, ?, ?)',
            [nom, prenom, tel, email,hashedPassword]
        );

        const insertId = result.insertId; //a ne pas supprimer

        await pool.execute(
            'INSERT INTO Compte_Client (id_compte) VALUES (?)',
            [insertId]
        );

        const compte = { id_compte: result.id_compte, nom, prenom, tel, email };
        return res.status(201).json({compte});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du compte.' });
    }
}


module.exports = {createAdmin, createClient };