const {pool} = require('../database/connect');

const getNotif = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM Notif order by id_notif desc;');
        res.json(result);
    } catch (error) {
        console.error("Erreur lors de la recherche des notifications :", error.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche des notifications." });
    }
};
const countNotif = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT COUNT(*) AS count FROM Notif;');
        res.json(result[0]);
    } catch (error) {
        console.error("Erreur lors de la recherche des notifications :", error.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche des notifications." });
    }
};
const deleteNotif = async (req, res) => {
    try {
        const {id}=req.body;
        const [result] = await pool.execute('DELETE FROM Notif where id_notif = ?;', [id]);
        res.json(result);
    } catch (error) {
        console.error("Erreur lors de la recherche des notifications :", error.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche des notifications." });
    }
};
const createNotif = async (req, res) => {
    try {
        const {id_plant ,type ,title ,contenu}=req.body;
        const [result] = await pool.execute('INSERT INTO Notif (id_plant ,type ,title ,time ,contenu) VALUES (?,?);', [id_plant ,type ,title ,Date.now() ,contenu]);
        res.json(result);
    } catch (error) {
        console.error("Erreur lors de la recherche des notifications :", error.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche des notifications." });
    }
};


module.exports = { getNotif,countNotif,deleteNotif,createNotif };