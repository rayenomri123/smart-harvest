const {pool} = require('../database/connect');

const getNotif = async (req, res) => {
    try {
        const [result] = await pool.execute('SELECT * FROM Notif;');
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

        const [result] = await pool.execute('DELETE FROM Notif where id_notif = ?;', [req.params.id]);
        res.json(result);
    } catch (error) {
        console.error("Erreur lors de la recherche des notifications :", error.message);
        res.status(500).json({ error: "Une erreur est survenue lors de la recherche des notifications." });
    }
};

module.exports = { getNotif,countNotif,deleteNotif };