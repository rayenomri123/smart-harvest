const express = require('express');
const router = express.Router();
const authController = require('../controllers/notifController');


router.get('/all', authController.getNotif);
router.post('/count', authController.countNotif);
router.delete('/del', authController.deleteNotif);
router.delete('/create', authController.createNotif);

module.exports = router; 