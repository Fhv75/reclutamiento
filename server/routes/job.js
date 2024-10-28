// routes/job.js
const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobsByRecruiter,
    updateJob,
    disableJob,
    searchJobs
} = require('../controllers/job');
const authMiddleware = require('../middleware/auth');


// Crear una nueva oferta de trabajo (solo para reclutadores)
router.post('/create', authMiddleware, authMiddleware.recruiter, createJob);

// Obtener todas las ofertas de trabajo de un reclutador (solo para reclutadores)
router.get('/recruiter', authMiddleware, authMiddleware.recruiter, getJobsByRecruiter);

// Editar una oferta de trabajo (solo para reclutadores)
router.put('/edit/:jobId', authMiddleware, authMiddleware.recruiter, updateJob);

// Deshabilitar una oferta de trabajo (solo para reclutadores)
router.put('/disable/:jobId', authMiddleware, authMiddleware.recruiter, disableJob);

// Buscar y filtrar ofertas de trabajo (público)
router.get('/search', searchJobs);

module.exports = router;