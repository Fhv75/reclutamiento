import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Flex, Stack, Divider, Icon, Avatar } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import Sidebar from './Sidebar';
import JobForm from './JobForm';
import JobCard from './JobCard';
import { FaUsers, FaBriefcase, FaPlus } from 'react-icons/fa';
import { API_URL } from './config';

function RecruiterDashboard() {
    const navigate = useNavigate();
    const toast = useToast();
    const [showJobForm, setShowJobForm] = useState(false);
    const [jobFormMode, setJobFormMode] = useState('create');
    const [jobIdToEdit, setJobIdToEdit] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [recruiterName, setRecruiterName] = useState('');
    const [showDisabledJobs, setShowDisabledJobs] = useState(false);

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName'); // Eliminamos el nombre también
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        navigate('/auth');
    };

    // Fetch para obtener las ofertas de trabajo del reclutador y el nombre
    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${API_URL}/job/recruiter`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        const fetchRecruiterName = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await axios.get(`${API_URL}/recruiter/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecruiterName(response.data.name);
            } catch (error) {
                console.error('Error fetching recruiter profile:', error);
            }
        };

        fetchJobs();
        fetchRecruiterName();
    }, []);

    const handleCreateJob = () => {
        setJobFormMode('create');
        setJobIdToEdit(null);
        setShowJobForm(true);
    };

    const handleEditJob = (jobId) => {
        setJobFormMode('edit');
        setJobIdToEdit(jobId);
        setShowJobForm(true);
    };

    const handleDisableJob = async (jobId) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`${API_URL}/job/disable/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast({
                title: "Oferta deshabilitada",
                description: "La oferta ha sido deshabilitada correctamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setJobs(prevJobs => prevJobs.map(job => job._id === jobId ? { ...job, status: 'disabled' } : job));
        } catch (error) {
            console.error("Error disabling job:", error);
        }
    };

    const handleEnableJob = async (jobId) => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.put(`${API_URL}/job/enable/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast({
                title: "Oferta habilitada",
                description: "La oferta ha sido habilitada correctamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setJobs(prevJobs => prevJobs.map(job => job._id === jobId ? { ...job, status: 'active' } : job));
        } catch (error) {
            console.error("Error enabling job:", error);
        }
    };

    return (
        <Flex>
            {/* Sidebar */}
            <Sidebar
                links={[
                    { text: 'Ofertas de Trabajo', to: '#', icon: FaBriefcase },
                    { text: 'Revisión de Candidatos', to: '#', icon: FaUsers }
                ]}
                onLogout={handleLogout}
            />

            {/* Contenido Principal */}
            <Box
                ml="250px"
                p="8"
                bg="gray.100"
                minH="100vh"
                flex="1"
            >
                <Stack spacing="6" align="center">
                    {/* Tarjeta de Información del Reclutador */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" mb="4" maxW="1100px" width="100%">
                        <Flex align="center">
                            <Avatar size="lg" name={recruiterName} />
                            <Box ml="4">
                                <Text fontWeight="bold" fontSize="lg">{recruiterName}</Text>
                                <Text color="gray.500">Reclutador de RRHH | Ingoude Foundation</Text>
                            </Box>
                        </Flex>
                        <Divider my="4" />
                        <Flex justify="space-between">
                            <Button leftIcon={<FaPlus />} colorScheme="cyan" variant="outline" size="sm" onClick={handleCreateJob}>
                                Crear Nueva Oferta
                            </Button>
                            <Button colorScheme="teal" variant="outline" size="sm" onClick={() => setShowDisabledJobs(!showDisabledJobs)}>
                                {showDisabledJobs ? 'Ocultar Ofertas Deshabilitadas' : 'Mostrar Ofertas Deshabilitadas'}
                            </Button>
                        </Flex>
                    </Box>

                    {/* Mostrar el formulario para crear o editar ofertas de trabajo */}
                    {showJobForm && (
                        <JobForm
                            mode={jobFormMode}
                            jobId={jobFormMode === 'edit' ? jobIdToEdit : null}
                            onClose={() => setShowJobForm(false)}
                        />
                    )}

                    {/* Sección de Ofertas de Trabajo */}
                    <Box maxW="1100px" width="100%">
                        <Flex align="center" mb="4">
                            <Icon as={FaBriefcase} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Gestión de Ofertas de Trabajo</Text>
                        </Flex>
                        <Divider mb="4" />
                        {jobs
                            .filter(job => showDisabledJobs || job.status === 'active')
                            .map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    onEdit={() => handleEditJob(job._id)}
                                    onDisable={() => handleDisableJob(job._id)}
                                    onEnable={() => handleEnableJob(job._id)}
                                />
                            ))}
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
}

export default RecruiterDashboard;
