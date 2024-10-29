import React, { useState, useEffect } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, useToast } from "@chakra-ui/react";
import axios from 'axios';
import { API_URL } from './config';

function JobForm({ mode, jobId, onClose }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [requirements, setRequirements] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (mode === 'edit' && jobId) {
            const fetchJob = async () => {
                const token = localStorage.getItem('authToken');
                try {
                    const response = await axios.get(`${API_URL}/job/${jobId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const job = response.data;

                    // Setear los valores para edición
                    setTitle(job.title);
                    setDescription(job.description);
                    setLocation(job.location);
                    setRequirements(job.requirements.join(', ')); // Convertimos a string para mostrar en el Textarea
                } catch (error) {
                    console.error("Error fetching job:", error);
                    toast({
                        title: "Error",
                        description: "Hubo un problema al cargar la oferta de trabajo.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            };
            fetchJob();
        }
    }, [mode, jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            const headers = { Authorization: `Bearer ${token}` };
            const jobData = {
                title,
                description,
                location,
                requirements: requirements.split(',').map(req => req.trim()) // Convertimos de nuevo a array
            };

            if (mode === 'create') {
                await axios.post(`${API_URL}/job/create`, jobData, { headers });
                toast({
                    title: "Oferta creada",
                    description: "La oferta de trabajo se ha creado correctamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else if (mode === 'edit') {
                await axios.put(`${API_URL}/job/edit/${jobId}`, jobData, { headers });
                toast({
                    title: "Oferta actualizada",
                    description: "La oferta de trabajo se ha actualizado correctamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }

            onClose();
        } catch (error) {
            let errorMessage = "Error al guardar la oferta.";
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="1100px" width="100%">
            <form onSubmit={handleSubmit}>
                <FormControl mb="4">
                    <FormLabel>Título de la Oferta</FormLabel>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título de la oferta"
                        required
                    />
                </FormControl>
                <FormControl mb="4">
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción de la oferta"
                        required
                    />
                </FormControl>
                <FormControl mb="4">
                    <FormLabel>Ubicación</FormLabel>
                    <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ubicación del trabajo (ej. Remoto, Ciudad)"
                        required
                    />
                </FormControl>
                <FormControl mb="4">
                    <FormLabel>Requisitos</FormLabel>
                    <Textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Lista de requisitos separados por coma"
                        required
                    />
                </FormControl>
                <Button type="submit" colorScheme="cyan" isLoading={loading} width="full">
                    {mode === 'create' ? 'Publicar Oferta' : 'Actualizar Oferta'}
                </Button>
            </form>
        </Box>
    );
}

export default JobForm;
