//list des url qui peuve utiliser le backend (api(GET,POST ....))
const whiltelist = [
    'http://localhost:5173',
    'http://localhost:3500'
    ];
const corsOptions = {
    origin: (origin, callback) => {
        if(whiltelist.includes('*') || whiltelist.indexOf(origin) !== -1 || !origin){// remove !origin from the list and the add *
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    credentials: true, // Si on utilise des cookies ou des tokens d'authentification
    optionsSuccessStatus: 200
};

module.exports = corsOptions;