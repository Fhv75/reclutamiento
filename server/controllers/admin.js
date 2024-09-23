const User = require('../models/user');

// Controlador para cambiar el rol de un usuario
exports.changeUserRole = async (req, res) => {
    const {
        id
    } = req.params;
    const {
        role
    } = req.body;

    // Solo permitir cambiar a los roles válidos
    const validRoles = ['candidate', 'recruiter'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: 'Rol no válido.'
        });
    }

    try {
        // Verificar si el usuario existe
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado.'
            });
        }

        // Actualizar el rol del usuario
        user.role = role;
        await user.save();

        res.json({
            message: `Rol actualizado a ${role} para el usuario ${user.name}.`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};

// Controlador para crear un nuevo reclutador
exports.createRecruiter = async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'El usuario ya existe.'
            });
        }

        // Crear un nuevo usuario con rol de "reclutador"
        const newUser = new User({
            name,
            email,
            password,
            role: 'recruiter' // Establecer el rol a "reclutador"
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        res.status(201).json({
            message: 'Reclutador creado exitosamente.',
            user: newUser
        });
    } catch (error) {
        console.error('Error al crear el reclutador:', error);
        res.status(500).json({
            message: 'Error en el servidor. Inténtalo de nuevo.'
        });
    }
};
