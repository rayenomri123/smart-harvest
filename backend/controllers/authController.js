const bcrypt = require('bcrypt');
const {pool} = require('../database/connect');
const jwt = require('jsonwebtoken');
const { admin } = require('../config/roleList');

const handleLogin = async (req, res) => {

    const { email,tel, pwd } = req.body;
    if ((!email && !tel) || !pwd) return res.status(400).json({ 'message': 'mail or phone number and password are required.' });
    
    const [users] =!email ?await pool.execute('SELECT * FROM Compte where numero_tel = ?', [tel || null])
                        :await pool.execute('SELECT * FROM Compte where adresse_email = ?', [email || null]);


    const foundUser = users[0];

    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.mot_de_passe);
    
    const [client]=await pool.execute("SELECT * FROM Compte_Client WHERE id_compte = ?",[foundUser.id_compte]);
    const [Admin]=await pool.execute("SELECT * FROM Compte_Admin WHERE id_compte = ?",[foundUser.id_compte]);
    let role="";

    if(Admin[0]!=null && Admin.length > 0) {
        role = "admin";
    }
    else if(client[0]!=null && client.length > 0) {
        role = "client";
    }
    role = "none";
    const user ={
        id: foundUser.id_compte,
        role: role
    }
    req.user = user;
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { 
                "id_compte": foundUser.id_compte,
                "role": role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { 
                "id_compte": foundUser.id_compte,
                "role": role
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '10d' }
        );
        // Saving refreshToken with current user
        const [rows] = await pool.execute('SELECT * FROM refresh_tokens WHERE id_compte = ?', [foundUser.id_compte]);
        if (rows.length) {
            await pool.execute('UPDATE refresh_tokens SET refresh_token = ? WHERE id_compte = ?', [refreshToken, foundUser.id_compte]);
        } else {
            await pool.execute('INSERT INTO refresh_tokens (id_compte, refresh_token) VALUES (?, ?)', [foundUser.id_compte, refreshToken]);
        }


        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };