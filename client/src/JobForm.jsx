// JobForm.jsx
import { Box, FormControl, FormLabel, Input, Textarea, Button, Stack, useToast, Heading, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "./config";
import Navbar from './Navbar';

function JobForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [requirements, setRequirements] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        if (jobId) {
            // Fetch de la oferta de trabajo para editar
            const fetchJob = async () => {
                const token = localStorage.getItem('authToken');
                try {
                    const response = await axios.get(`${API_URL}/job/recruiter`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const job = response.data.find((job) => job._id === jobId);
                    if (job) {
                        setTitle(job.title);
                        setDescription(job.description);
                        setLocation(job.location);
                        setRequirements(job.requirements.join(', '));
                    }
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
    }, [jobId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            if (jobId) {
                // Actualizar oferta de trabajo existente
                await axios.put(`${API_URL}/job/edit/${jobId}`, {
                    title,
                    description,
                    location,
                    requirements: requirements.split(',').map(req => req.trim())
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast({
                    title: "Oferta actualizada",
                    description: "La oferta de trabajo ha sido actualizada exitosamente.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                // Crear nueva oferta de trabajo
                await axios.post(`${API_URL}/job/create`, {
                    title,
                    description,
                    location,
                    requirements: requirements.split(',').map(req => req.trim())
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast({
                    title: "Oferta creada",
                    description: "La oferta de trabajo ha sido creada exitosamente.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }

            navigate('/recruiter/jobs');
        } catch (error) {
            let errorMessage = "Error al procesar la oferta de trabajo.";
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
        <Box bg="gray.100" minH="100vh">
            {/* Navbar */}
            <Navbar />

            {/* Contenedor principal */}
            <Box p="8" maxW="1000px" mx="auto">
                <Flex justify="space-between" align="center" mb="8">
                    <Heading color="cyan.600">{jobId ? 'Editar Oferta de Trabajo' : 'Crear Nueva Oferta de Trabajo'}</Heading>
                </Flex>
                <Box bg="white" p="6" borderRadius="md" shadow="sm">
                    <form onSubmit={handleSubmit}>
                        <Stack spacing="6">
                            <FormControl>
                                <FormLabel>Título de la Oferta</FormLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Título del puesto"
                                    required
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Descripción del puesto y responsabilidades"
                                    required
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Ubicación</FormLabel>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ubicación del trabajo (ej. Remoto, Ciudad)"
                                    required
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Requisitos</FormLabel>
                                <Input
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    placeholder="Lista de requisitos separados por coma"
                                    required
                                />
                            </FormControl>

                            <Button type="submit" colorScheme="cyan" isLoading={loading} width="full">
                                {jobId ? 'Actualizar Oferta' : 'Crear Oferta'}
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

export default JobForm;
