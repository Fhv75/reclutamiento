// CandidateDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Flex, Stack, Divider, Avatar, Icon } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './config';
import { useToast } from '@chakra-ui/react';
import Navbar from './Navbar';
import JobExplorer from './JobExplorer';  // Importar el nuevo componente
import { FaRegFileAlt, FaUserEdit, FaBriefcase } from 'react-icons/fa';

function CandidateDashboard() {
    const navigate = useNavigate();
    const toast = useToast();
    const [profile, setProfile] = useState(null);

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        navigate('/auth');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${API_URL}/candidate/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Convertir las fechas a formato amigable
                response.data.workExperience.forEach(work => {
                    work.startDate = new Date(work.startDate).toLocaleDateString();
                    work.endDate = work.endDate ? new Date(work.endDate).toLocaleDateString() : null;
                });
                response.data.certifications.forEach(cert => {
                    cert.date = new Date(cert.date).toLocaleDateString();
                });

                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <Box bg="gray.100" minH="100vh">
            {/* Navbar */}
            <Navbar onLogout={handleLogout} />

            {/* Contenedor principal del dashboard */}
            <Box p="8" maxW="1000px" mx="auto">
                <Stack spacing="6">
                    {/* Tarjeta de Información Personal */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" mb="4">
                        <Flex align="center">
                            <Button colorScheme="none" onClick={() => navigate("/candidate/profile")}>
                                <Avatar size="lg" name={profile?.user?.name || "Nombre Apellido"} src="https://bit.ly/dan-abramov" />
                            </Button>
                            <Box ml="4">
                                <Text fontWeight="bold" fontSize="lg" onClick={() => navigate("/candidate/profile")} cursor="pointer">
                                    {profile && profile.user ? profile.user.name : "Nombre Apellido"}
                                </Text>
                                <Text color="gray.500">{profile ? profile.phone : "+569 -"}</Text>
                                <Text color="gray.500" fontSize="sm">{profile && profile.location ? profile.location : "Ciudad, País"}</Text>
                            </Box>
                        </Flex>
                        <Divider my="4" />
                        <Flex justify="space-between">
                            <Button leftIcon={<FaUserEdit />} colorScheme="blue" variant="outline" size="sm" onClick={() => navigate("/candidate/edit-profile")}>
                                Editar Perfil
                            </Button>
                            <Button leftIcon={<FaBriefcase />} colorScheme="cyan" size="sm">
                                Ver Postulaciones
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección de Mis Postulaciones */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm">
                        <Flex align="center" mb="4">
                            <Icon as={FaRegFileAlt} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Mis Postulaciones</Text>
                        </Flex>
                        <Divider mb="4" />
                        <Flex direction="column" align="start" gap="4">
                            <Button colorScheme="teal" variant="outline" size="sm">
                                Ver todas mis postulaciones
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección de Exploración de Ofertas */}
                    <JobExplorer />
                </Stack>
            </Box>
        </Box>
    );
}

export default CandidateDashboard;
