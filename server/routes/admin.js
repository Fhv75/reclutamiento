const express = require('express');
const router = express.Router();
const {
    changeUserRole,
    createRecruiter
} = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');

// Ruta para cambiar el rol de un usuario (solo accesible para admin)
router.put('/change-role/:id', authMiddleware, authMiddleware.admin, changeUserRole);

// Ruta para crear un nuevo reclutador (solo accesible para admin)
router.post('/create-recruiter', authMiddleware, authMiddleware.admin, createRecruiter);

module.exports = router;
