const express = require('express');
const router = express.Router();
const path = require('path');
const plantsController = require('../controllers/plantsController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');


router.get('/all', plantsController.getAllPlants);
router.get('/all_sensors', plantsController.getAllSensors);
router.post('/get_sensors_id', plantsController.getSensorsById);
router.post('/create',verifyRoles(roles_list.admin), plantsController.createPlant);
router.post('/:id/addSensor',verifyRoles(roles_list.admin), plantsController.addSensor);
router.post('/:id/deleteSensor',verifyRoles(roles_list.admin), plantsController.deleteSensor);
router.get('/:id', plantsController.getPlantInfo);
router.delete('/delete',verifyRoles(roles_list.admin), plantsController.deletePlant);
router.post('/change_mode', plantsController.changeModeById);


module.exports = router;
