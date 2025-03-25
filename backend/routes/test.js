const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/testController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');

router.get('/', logoutController.test);

module.exports = router;