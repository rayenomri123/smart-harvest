const {pool} = require('../database/connect');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const [user]= await pool.execute('SELECT * FROM Compte WHERE id_compte = (SELECT id_compte FROM refresh_tokens WHERE refresh_token = ?)', [refreshToken]);
    const foundUser = user[0];

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    await pool.execute('DELETE FROM refresh_tokens WHERE refresh_token = ?', [refreshToken]);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }