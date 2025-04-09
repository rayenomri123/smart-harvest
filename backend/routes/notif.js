const express = require('express');
const router = express.Router();
const authController = require('../controllers/notifController');


router.get('/all', authController.getNotif);
router.get('/count', authController.countNotif);
router.delete('/del', authController.deleteNotif);
router.post('/create', authController.createNotif);

module.exports = router; 