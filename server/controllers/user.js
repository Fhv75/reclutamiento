// controllers/user.js
const User = require('../models/user');

// Obtener el perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({
            message: 'Error al obtener el perfil del usuario'
        });
    }
};
