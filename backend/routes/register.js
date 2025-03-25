const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');


//data needed to register Admin : nom, prenom, tel, email , password
router.post('/compte/admin',verifyRoles(roles_list.admin), registerController.createAdmin);

//data needed to register client : nom, prenom, tel, email , password
router.post('/compte/client',verifyRoles(roles_list.admin), registerController.createClient);

module.exports = router;