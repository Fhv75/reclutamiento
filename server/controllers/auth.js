const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    JWT_SECRET
} = require('../config');

// Controlador de registro de usuarios
exports.register = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({
            email
        });
        if (user) {
            return res.status(400).json({
                message: 'El usuario ya existe.'
            });
        }

        // Crear un nuevo usuario
        user = new User({
            name,
            email,
            password
        });

        await user.save();

        // Generar un token JWT
        const payload = {
            userId: user._id
        };
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role 
            }            
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};

// Controlador de inicio de sesión
exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                message: 'Credenciales inválidas.'
            });
        }

        // Verificar la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Credenciales inválidas.'
            });
        }

        // Generar un token JWT
        const payload = {
            userId: user._id
        };
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};
