const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyRoles = require('../middleware/verifyRoles');
const roles_list = require('../config/roleList');

router.get('/all', userController.getAllUsers);
// router.post('/', userController.createUser);

router.get('/:id', userController.getUser);

//needed data : nom, prenom, numero_tel, adresse_email
router.put('/:id/update',verifyRoles(roles_list.admin), userController.updateUsers);

router.delete('/:id/delete',verifyRoles(roles_list.admin), userController.deleteUsers);

//needed data : nom, prenom, numero_tel, adresse_email
router.put('/update', userController.updateUser);

router.delete('/delete', userController.deleteUser);

module.exports = router;