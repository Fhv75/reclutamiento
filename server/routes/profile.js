const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const authMiddleware = require('../middleware/auth');

// Rutas de perfil
router.post('/candidate/profile', authMiddleware, profileController.createOrUpdateProfile);
router.get('/candidate/profile', authMiddleware, profileController.getProfile);
router.delete('/candidate/profile', authMiddleware, profileController.deleteProfile);

module.exports = router;
