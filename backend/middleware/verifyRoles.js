const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const cookies = req.cookies;
        console.log(req.cookies)
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.sendStatus(403); // Token invalide ou expiré

                // Récupérer le rôle dans une variable
                const userRole = decoded.role;
                console.log("123",decoded)
                // Vérifier que le rôle existe
                if (!userRole) return res.sendStatus(401); // Pas de rôle dans le token

                // Stocker l'utilisateur dans req.user (optionnel, pour compatibilité)
                req.user = {
                    id: decoded.id_compte,
                    role: userRole
                };
                
                // Vérifier si le rôle est autorisé
                const rolesArray = [...allowedRoles];
                const result = rolesArray.includes(userRole); // Vérifie si le rôle est dans les rôles autorisés

                if (!result) return res.sendStatus(403); // Rôle non autorisé
                next(); // Passe au middleware suivant
            }
        );
    };
}


module.exports = verifyRoles;