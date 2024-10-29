const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa cors
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/job'); // Importa las rutas de ofertas de trabajo
const {
    PORT,
    MONGO_URI
} = require('./config');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost', // Reemplaza con el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Permitir el envío de cookies y encabezados de autorización
}));

// Middleware
app.use(express.json()); // Parseo de JSON

// Rutas
app.use('/api', profileRoutes); // Rutas de perfil
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Rutas para administración (si existe)
app.use('/api/job', jobRoutes); // Usar las rutas de ofertas de trabajo

// Conexión a la base de datos. Reintentar si falla
const connectWithRetry = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => {
        console.error(error);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
