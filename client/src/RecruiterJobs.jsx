// RecruiterJobs.jsx
import { useState, useEffect } from 'react';
import { Box, Heading, Stack, Button, Text, Divider, Flex, Icon, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { API_URL } from './config';
import Navbar from './Navbar'; // Asegúrate de tener este componente

function RecruiterJobs() {
    const [jobs, setJobs] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();

    // Fetch de todas las ofertas creadas por el reclutador
    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${API_URL}/job/recruiter`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast({
                    title: "Error",
                    description: "Hubo un problema al cargar las ofertas de trabajo. Por favor, intenta nuevamente.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchJobs();
    }, []);

    // Manejar la deshabilitación de una oferta de trabajo
    const handleDisableJob = async (jobId) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`${API_URL}/job/disable/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobs.map(job => job._id === jobId ? { ...job, status: 'disabled' } : job));
            toast({
                title: "Oferta deshabilitada",
                description: "La oferta de trabajo se ha deshabilitado exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error disabling job:', error);
            toast({
                title: "Error",
                description: "Hubo un problema al deshabilitar la oferta de trabajo.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box bg="gray.100" minH="100vh">
            {/* Navbar */}
            <Navbar />

            {/* Contenedor principal */}
            <Box p="8" maxW="1000px" mx="auto">
                <Flex justify="space-between" align="center" mb="8">
                    <Heading color="cyan.600">Mis Ofertas de Trabajo</Heading>
                    <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={() => navigate('/job/create')}>
                        Crear Nueva Oferta
                    </Button>
                </Flex>

                <Stack spacing="6">
                    {jobs.length === 0 ? (
                        <Text>No tienes ofertas de trabajo publicadas actualmente.</Text>
                    ) : (
                        jobs.map(job => (
                            <Box key={job._id} bg="white" p="6" borderRadius="md" shadow="sm">
                                <Flex justify="space-between" align="center">
                                    <Box>
                                        <Heading size="md" mb="2">{job.title}</Heading>
                                        <Text color="gray.500">{job.location}</Text>
                                        <Text mt="2">{job.description}</Text>
                                        <Text mt="2" color="cyan.600">Estado: {job.status}</Text>
                                    </Box>
                                    <Flex direction="column" gap="2">
                                        <Button
                                            leftIcon={<FaEdit />}
                                            colorScheme="blue"
                                            onClick={() => navigate(`/job/edit/${job._id}`)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            leftIcon={<FaTrashAlt />}
                                            colorScheme="red"
                                            variant="outline"
                                            onClick={() => handleDisableJob(job._id)}
                                            isDisabled={job.status === 'disabled'}
                                        >
                                            Deshabilitar
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Box>
                        ))
                    )}
                </Stack>
            </Box>
        </Box>
    );
}

export default RecruiterJobs;
