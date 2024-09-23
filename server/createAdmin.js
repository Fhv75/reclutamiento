const mongoose = require('mongoose');
const User = require('./models/user');
const {
    MONGO_URI
} = require('./config');

async function createAdmin() {
    try {
        // Conectarse a la base de datos
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Verificar si ya existe un usuario administrador
        const adminExists = await User.findOne({
            role: 'admin'
        });
        if (adminExists) {
            console.log('Ya existe un usuario administrador.');
            return;
        }

        // Crear el usuario administrador por defecto
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@admin.com',
            password: 'admin', // Cambia esto después de la creación inicial
            role: 'admin'
        });

        await adminUser.save();
        console.log('Usuario administrador creado con éxito.');
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
    } finally {
        mongoose.connection.close();
    }
}

createAdmin();
