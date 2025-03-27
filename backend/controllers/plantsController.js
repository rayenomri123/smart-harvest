const {pool} = require('../database/connect');
require('dotenv').config();

const getAllSensors = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM SensorType');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
}

const getAllPlants = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Plant');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const createPlant = async (req, res) => {
    try {
        const {nom,mode} = req.body;
        const [rows] = await pool.query('INSERT INTO Plant (nom,mode) VALUES (?,?)', [nom,mode]);
        res.status(201).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const addSensor = async (req, res) => {
    try {
        const {id_pin, id_sensor_type} = req.body;
        const [rows2] = await pool.query('INSERT IGNORE INTO Pin (id_pin, id_sensor_type) VALUES (?, ?)', [id_pin, id_sensor_type]);
        const [rows] = await pool.query('INSERT INTO Pin_Plant (id_plant, id_pin) VALUES (?, ?)', [req.params.id, id_pin]);
        res.status(201).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const deleteSensor = async (req, res) => {
    try {
        const [rows] = await pool.query('DELETE FROM Pin_Plant WHERE id_pin = ? AND id_plant = ?', [req.body.id_pin, req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const getPlantInfo = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT Plant.name,sensor.nom,v.* FROM Plant, Val v,sensorType sensor,Pin_Plant pp,Pin p where v.id_pin=p.id_pin and p.id_pin=pp.id_pin and p.id_pin=sensor.id_pin and Plant.id_plant = pp.id_plant and pp.id_plant=?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

const deletePlant = async (req, res) => {
    try {
        const [rows] = await pool.query('DELETE FROM Plant WHERE id_plant = ?', [req.params.id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = {getAllPlants, createPlant, addSensor, deleteSensor, getPlantInfo, deletePlant,getAllSensors};