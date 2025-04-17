const express = require('express');
const router = express.Router();
const path = require('path');
const dataController = require('../controllers/dataController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');


router.post('/history', dataController.history);


module.exports = router;
