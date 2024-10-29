// routes/job.js
const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobsByRecruiter,
    updateJob,
    disableJob,
    searchJobs,
    getAllJobs,
    getJobById,
    enableJob
} = require('../controllers/job');
const authMiddleware = require('../middleware/auth');

// Rutas para gestionar ofertas

// Obtener todas las ofertas de trabajo de un reclutador (solo para reclutadores)
router.get('/recruiter', authMiddleware, authMiddleware.recruiter, getJobsByRecruiter);

// Endpoint para listar todas las ofertas de trabajo
router.get('/list', getAllJobs);

// Buscar y filtrar ofertas de trabajo (público)
router.get('/search', searchJobs);

// Crear una nueva oferta de trabajo (solo para reclutadores)
router.post('/create', authMiddleware, authMiddleware.recruiter, createJob);

// Editar una oferta de trabajo (solo para reclutadores)
router.put('/edit/:jobId', authMiddleware, authMiddleware.recruiter, updateJob);

// Deshabilitar una oferta de trabajo (solo para reclutadores)
router.put('/disable/:jobId', authMiddleware, authMiddleware.recruiter, disableJob);

// Habilitar una oferta de trabajo (solo para reclutadores)
router.put('/enable/:jobId', authMiddleware, authMiddleware.recruiter, enableJob);

// Obtener una oferta de trabajo por ID (público)
router.get('/:jobId', getJobById);

module.exports = router;
