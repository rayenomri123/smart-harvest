const {pool} = require('../database/connect');
require('dotenv').config();

const history = async (req, res) => {
    try {
        const {id_plant, detector} = req.body;
        const [rows] = await pool.query('SELECT v.* FROM SensorType s, Pin_Plant pp, Pin p, Val v where v.id_pin=p.id_pin and p.id_pin=pp.id_pin and p.id_sensor_type=s.id_sensor_type and pp.id_plant=? and s.nom=? limit 20', [id_plant,detector]);
        
        res.status(200).json(rows);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};


module.exports = {history};