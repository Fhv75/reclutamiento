// controllers/job.js
const Job = require('../models/job');
const mongoose = require('mongoose');

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
    console.log('Recruiter ID:', recruiterId); // <-- Añadir esto

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
        return res.status(400).json({
            message: 'ID de reclutador no válido'
        });
    }

    try {
        const jobs = await Job.find({
            recruiter: recruiterId
        });
        res.json(jobs);
    } catch (error) {
        console.error('Error al obtener las ofertas de trabajo:', error);
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

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find(); // Busca todas las ofertas
        res.status(200).json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las ofertas de trabajo.'
        });
    }
};

// Obtener una oferta de trabajo específica
exports.getJobById = async (req, res) => {
    const {
        jobId
    } = req.params;
    console.log("yo tf")
    try {
        const job = await Job.findById(jobId);
                          
        if (!job) {
            return res.status(404).json({
                message: 'Oferta de trabajo no encontrada'
            });
        }

        res.json(job);
    } catch (error) {
        console.error('Error al obtener la oferta de trabajo:', error);
        res.status(500).json({
            message: 'Error al obtener la oferta de trabajo'
        });
    }
};

exports.enableJob = async (req, res) => {
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

        job.status = 'active';
        await job.save();
        res.json({
            message: 'Oferta de trabajo habilitada exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al habilitar la oferta de trabajo'
        });
    }
}
