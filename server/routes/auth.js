const express = require('express');
const router = express.Router();
const {
    register,
    login
} = require('../controllers/auth');

// Ruta para registro de usuarios
router.post('/register', register);

// Ruta para inicio de sesión
router.post('/login', login);

module.exports = router;
