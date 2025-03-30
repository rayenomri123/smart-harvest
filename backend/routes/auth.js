const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//need need to login : (email or tel) and pwd
router.post('/', authController.handleLogin);

module.exports = router; 