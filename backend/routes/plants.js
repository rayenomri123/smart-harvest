const express = require('express');
const router = express.Router();
const path = require('path');
const plantsController = require('../controllers/plantsController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');


router.get('/all', plantsController.getAllPlants);
router.post('/create',verifyRoles(roles_list.admin), plantsController.createPlant);
router.post('/:id/addSensor',verifyRoles(roles_list.admin), plantsController.addSensor);
router.post('/:id/deleteSensor',verifyRoles(roles_list.admin), plantsController.deleteSensor);
router.get('/:id', plantsController.getPlantInfo);
router.delete('/:id/delete',verifyRoles(roles_list.admin), plantsController.deletePlant);

module.exports = router;
