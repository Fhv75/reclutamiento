const jwt = require('jsonwebtoken');
const {
    JWT_SECRET
} = require('../config');
const User = require('../models/user');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    // Remover 'Bearer ' del token
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            message: 'No hay token, autorización denegada.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId; // Guardar el ID del usuario en la solicitud
        next();
    } catch (err) {
        res.status(401).json({
            message: 'Token no válido.'
        });
    }
};

// Middleware de autorización para administradores
authMiddleware.admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user); // Obtener el usuario por su ID
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({
                message: 'Acceso denegado, no eres un administrador.'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};

// Middleware de autorización para reclutadores
authMiddleware.recruiter = async (req, res, next) => {
    try {
        const user = await User.findById(req.user); // Obtener el usuario por su ID
        if (user && user.role === 'recruiter') {
            next();
        } else {
            res.status(403).json({
                message: 'Acceso denegado, no eres un reclutador.'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};

module.exports = authMiddleware;
