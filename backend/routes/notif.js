const express = require('express');
const router = express.Router();
const authController = require('../controllers/notifController');


router.get('/all', authController.getNotif);
router.post('/count', authController.countNotif);
router.delete('/:id/del', authController.deleteNotif);

module.exports = router; 