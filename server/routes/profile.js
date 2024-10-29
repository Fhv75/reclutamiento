const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const userController = require('../controllers/user');
const authMiddleware = require('../middleware/auth');

// Rutas de perfil
router.post('/candidate/profile', authMiddleware, profileController.createOrUpdateProfile);
router.get('/candidate/profile', authMiddleware, profileController.getProfile);
router.delete('/candidate/profile', authMiddleware, profileController.deleteProfile);

router.get('/recruiter/profile', authMiddleware, userController.getUserProfile);
module.exports = router;
