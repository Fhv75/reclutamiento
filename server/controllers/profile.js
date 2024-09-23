const Profile = require('../models/profile');
const User = require('../models/user');

// Crear o actualizar perfil
exports.createOrUpdateProfile = async (req, res) => {
    const userId = req.user;
    const {
        name, // Incluir el nombre del usuario
        bio,
        skills,
        location,
        phone,
        workExperience,
        education,
        certifications
    } = req.body;

    try {
        // Buscar el perfil existente del usuario
        let profile = await Profile.findOne({
            user: userId
        });

        // Actualizar el nombre del usuario en el modelo User
        await User.findByIdAndUpdate(userId, {
            name
        });

        if (profile) {
            // Actualizar perfil existente
            profile.bio = bio;
            profile.skills = skills;
            profile.location = location;
            profile.phone = phone;
            profile.workExperience = workExperience;
            profile.education = education;
            profile.certifications = certifications;
        } else {
            // Crear nuevo perfil
            profile = new Profile({
                user: userId,
                bio,
                skills,
                location,
                phone,
                workExperience,
                education,
                certifications
            });
        }

        // Guardar perfil actualizado o nuevo
        await profile.save();

        res.json({
            message: 'Perfil guardado correctamente',
            profile
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al guardar el perfil'
        });
    }
};

// Obtener perfil del candidato
exports.getProfile = async (req, res) => {
    const userId = req.user;

    try {
        const profile = await Profile.findOne({
            user: userId
        }).populate('user', 'name email');

        if (!profile) {
            return res.status(404).json({
                message: 'Perfil no encontrado'
            });
        }
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener el perfil'
        });
    }
};

// Eliminar perfil del candidato
exports.deleteProfile = async (req, res) => {
    const userId = req.user;

    try {
        const profile = await Profile.findOneAndDelete({
            user: userId
        });

        if (!profile) {
            return res.status(404).json({
                message: 'Perfil no encontrado'
            });
        }

        res.json({
            message: 'Perfil eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar el perfil'
        });
    }
};
