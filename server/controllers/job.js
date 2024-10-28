// controllers/job.js
const Job = require('../models/job');

// Crear una nueva oferta de trabajo
exports.createJob = async (req, res) => {
    const {
        title,
        description,
        location,
        requirements
    } = req.body;
    const recruiterId = req.user; // Obtenemos el ID del usuario desde el middleware de autenticación

    try {
        const newJob = new Job({
            title,
            description,
            location,
            requirements,
            recruiter: recruiterId,
        });

        await newJob.save();
        res.status(201).json({
            message: 'Oferta de trabajo creada exitosamente',
            job: newJob
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al crear la oferta de trabajo'
        });
    }
};

// Obtener todas las ofertas de trabajo de un reclutador
exports.getJobsByRecruiter = async (req, res) => {
    const recruiterId = req.user;

    try {
        const jobs = await Job.find({
            recruiter: recruiterId
        });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las ofertas de trabajo'
        });
    }
};

// Editar una oferta de trabajo
exports.updateJob = async (req, res) => {
    const {
        jobId
    } = req.params;
    const {
        title,
        description,
        location,
        requirements
    } = req.body;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: 'Oferta de trabajo no encontrada'
            });
        }

        job.title = title;
        job.description = description;
        job.location = location;
        job.requirements = requirements;

        await job.save();
        res.json({
            message: 'Oferta de trabajo actualizada exitosamente',
            job
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar la oferta de trabajo'
        });
    }
};

// Deshabilitar una oferta de trabajo
exports.disableJob = async (req, res) => {
    const {
        jobId
    } = req.params;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: 'Oferta de trabajo no encontrada'
            });
        }

        job.status = 'disabled';
        await job.save();
        res.json({
            message: 'Oferta de trabajo deshabilitada exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al deshabilitar la oferta de trabajo'
        });
    }
};

// Buscar y filtrar ofertas de trabajo (público)
exports.searchJobs = async (req, res) => {
    const {
        keyword,
        location,
        modality,
        area
    } = req.query;

    try {
        const filters = {
            status: 'active', // Solo ofertas activas
        };

        if (keyword) {
            filters.title = {
                $regex: keyword,
                $options: 'i'
            };
        }
        if (location) {
            filters.location = location;
        }
        // Otros filtros podrían incluir modalidad o área

        const jobs = await Job.find(filters);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar ofertas de trabajo'
        });
    }
};
