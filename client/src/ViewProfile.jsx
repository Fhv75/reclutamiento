import { Box, Text, Flex, Heading, Button, Avatar, Divider, Icon, Stack, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import Navbar from './Navbar'; // Asegúrate de tener un componente Navbar

function ViewProfile() {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    // Configurar Axios con interceptor para manejar errores globales
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Redirigir al usuario a la página de autenticación si el token es inválido
                navigate('/auth');
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${API_URL}/candidate/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Convertir las fechas a dd-mm-aaaa (experiencia laboral, certificaciones)
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
            <Navbar />

            {/* Contenedor principal */}
            <Box p="8" maxW="1000px" mx="auto">
                <Stack spacing="6">
                    {/* Tarjeta de Información del Perfil */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm">
                        {profile ? (
                            <>
                                <Flex align="center" mb="4">
                                    <Avatar size="lg" name={profile.name} src="https://bit.ly/broken-link" />
                                    <Box ml="4">
                                        <Text fontWeight="bold" fontSize="lg">{profile.user.name}</Text>
                                        <Text color="gray.500" fontSize="sm">{profile.user.email}</Text>
                                        <Text color="gray.500" fontSize="sm">{profile.phone}</Text>
                                    </Box>
                                </Flex>
                                <Divider my="4" />
                                <Box>
                                    <Text mb="4">
                                        <Icon as={FaBriefcase} mr="2" color="cyan.500" />
                                        <strong>Biografía:</strong> {profile.bio}
                                    </Text>
                                    <Text mb="4">
                                        <Icon as={FaUserEdit} mr="2" color="cyan.500" />
                                        <strong>Habilidades:</strong> {profile.skills}
                                    </Text>
                                    <Text mb="4">
                                        <Icon as={FaMapMarkerAlt} mr="2" color="cyan.500" />
                                        <strong>Ubicación:</strong> {profile.location}
                                    </Text>
                                </Box>

                                {/* Sección de Experiencia Laboral */}
                                <Heading size="md" mb="4" color="cyan.600">
                                    <Icon as={FaBriefcase} mr="2" /> Experiencia Laboral
                                </Heading>
                                {profile.workExperience.length > 0 ? (
                                    profile.workExperience.map((work, index) => (
                                        <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                            <Text><strong>Empresa:</strong> {work.company}</Text>
                                            <Text><strong>Cargo:</strong> {work.position}</Text>
                                            <Text><strong>Período:</strong> {work.startDate} - {work.endDate || 'Presente'}</Text>
                                            <Text><strong>Descripción:</strong> {work.description}</Text>
                                        </Box>
                                    ))
                                ) : (
                                    <Text>No se ha añadido experiencia laboral.</Text>
                                )}

                                {/* Sección de Educación */}
                                <Heading size="md" mb="4" color="cyan.600">
                                    <Icon as={FaGraduationCap} mr="2" /> Educación
                                </Heading>
                                {profile.education.length > 0 ? (
                                    profile.education.map((edu, index) => (
                                        <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                            <Text><strong>Institución:</strong> {edu.institution}</Text>
                                            <Text><strong>Título:</strong> {edu.degree}</Text>
                                            <Text><strong>Período:</strong> {edu.startYear} - {edu.endYear}</Text>
                                        </Box>
                                    ))
                                ) : (
                                    <Text>No se ha añadido educación.</Text>
                                )}

                                {/* Sección de Certificaciones */}
                                <Heading size="md" mb="4" color="cyan.600">
                                    <Icon as={FaCertificate} mr="2" /> Certificaciones
                                </Heading>
                                {profile.certifications.length > 0 ? (
                                    profile.certifications.map((cert, index) => (
                                        <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                            <Text><strong>Certificación:</strong> {cert.name}</Text>
                                            <Text><strong>Institución:</strong> {cert.institution}</Text>
                                            <Text><strong>Fecha de Obtención:</strong> {cert.date}</Text>
                                        </Box>
                                    ))
                                ) : (
                                    <Text>No se ha añadido certificaciones.</Text>
                                )}

                                {/* Botón para Editar Perfil */}
                                <Button colorScheme="blue" mt="6" width="full" onClick={() => {navigate('/candidate/edit-profile')}}>
                                    Editar Perfil
                                </Button>
                            </>
                        ) : (
                            <Text>Cargando perfil...</Text>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default ViewProfile;
