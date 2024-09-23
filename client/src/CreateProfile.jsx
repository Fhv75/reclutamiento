import { Box, FormControl, FormLabel, Input, Textarea, Button, useToast, Flex, Heading, Divider, Avatar, Icon, SimpleGrid, Text, Stack } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaGraduationCap, FaBriefcase, FaCertificate } from 'react-icons/fa';
import Navbar from './Navbar';
import { API_URL } from './config'; // Asegúrate de tener este archivo para configurar la URL de la API

function CreateProfile() {
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [workExperience, setWorkExperience] = useState([{ company: '', position: '', startDate: '', endDate: '', description: '' }]);
    const [education, setEducation] = useState([{ institution: '', degree: '', startYear: '', endYear: '' }]);
    const [certifications, setCertifications] = useState([{ name: '', institution: '', date: '' }]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // Configurar Axios con interceptor para manejar errores globales
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Redirigir al usuario a la página de autenticación si el token es inválido
                navigate('/auth');
                toast({
                    title: "Sesión expirada",
                    description: "Por favor, inicia sesión de nuevo.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            return Promise.reject(error);
        }
    );

    // Manejo de creación de perfil
    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validar campos antes de enviar
        if (!bio || !skills || !location || !phone) {
            toast({
                title: "Campos incompletos",
                description: "Por favor, completa toda la información requerida.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${API_URL}/candidate/profile`,
                { bio, skills, location, phone, workExperience, education, certifications },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast({
                title: "Perfil creado",
                description: "Tu perfil ha sido creado exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            navigate('/candidate/profile');
        } catch (error) {
            let errorMessage = "Error al crear el perfil.";
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

    // Agregar nueva experiencia laboral
    const handleAddWorkExperience = () => {
        setWorkExperience([...workExperience, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
    };

    // Agregar nueva educación
    const handleAddEducation = () => {
        setEducation([...education, { institution: '', degree: '', startYear: '', endYear: '' }]);
    };

    // Agregar nueva certificación
    const handleAddCertification = () => {
        setCertifications([...certifications, { name: '', institution: '', date: '' }]);
    };

    return (
        <Box bg="gray.100" minH="100vh">
            {/* Navbar */}
            <Navbar />

            {/* Contenedor principal del formulario */}
            <Box p="8" maxW="1000px" mx="auto">
                <Stack spacing="6">
                    {/* Tarjeta de Creación de Perfil */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm">
                        <Flex align="center">
                            <Avatar size="lg" icon={<FaUser />} />
                            <Box ml="4">
                                <Text fontWeight="bold" fontSize="lg">Crear tu Perfil</Text>
                                <Text color="gray.500">Completa tu información para empezar a postular a trabajos</Text>
                            </Box>
                        </Flex>
                        <Divider my="4" />

                        {/* Formulario de creación de perfil */}
                        <form onSubmit={handleCreateProfile}>
                            <FormControl mb="4">
                                <FormLabel>Resumen Profesional</FormLabel>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Escribe un resumen de tu perfil profesional..."
                                    required
                                />
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel>Habilidades</FormLabel>
                                <Input
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="Escribe tus habilidades separadas por comas..."
                                    required
                                />
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel>Ubicación</FormLabel>
                                <Input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ciudad, País"
                                    required
                                />
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Número de contacto"
                                    required
                                />
                            </FormControl>

                            {/* Sección de Experiencia Laboral */}
                            <Heading size="md" mb="4" color="cyan.600">
                                <Icon as={FaBriefcase} mr="2" /> Experiencia Laboral
                            </Heading>
                            {workExperience.map((work, index) => (
                                <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                    <FormControl mb="2">
                                        <FormLabel>Empresa</FormLabel>
                                        <Input
                                            value={work.company}
                                            onChange={(e) => {
                                                const newWorkExperience = [...workExperience];
                                                newWorkExperience[index].company = e.target.value;
                                                setWorkExperience(newWorkExperience);
                                            }}
                                            placeholder="Nombre de la empresa"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl mb="2">
                                        <FormLabel>Cargo</FormLabel>
                                        <Input
                                            value={work.position}
                                            onChange={(e) => {
                                                const newWorkExperience = [...workExperience];
                                                newWorkExperience[index].position = e.target.value;
                                                setWorkExperience(newWorkExperience);
                                            }}
                                            placeholder="Cargo desempeñado"
                                            required
                                        />
                                    </FormControl>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <FormControl mb="2">
                                            <FormLabel>Fecha de Inicio</FormLabel>
                                            <Input
                                                type="date"
                                                value={work.startDate}
                                                onChange={(e) => {
                                                    const newWorkExperience = [...workExperience];
                                                    newWorkExperience[index].startDate = e.target.value;
                                                    setWorkExperience(newWorkExperience);
                                                }}
                                                required
                                            />
                                        </FormControl>
                                        <FormControl mb="2">
                                            <FormLabel>Fecha de Fin</FormLabel>
                                            <Input
                                                type="date"
                                                value={work.endDate}
                                                onChange={(e) => {
                                                    const newWorkExperience = [...workExperience];
                                                    newWorkExperience[index].endDate = e.target.value;
                                                    setWorkExperience(newWorkExperience);
                                                }}
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                    <FormControl mb="2">
                                        <FormLabel>Descripción</FormLabel>
                                        <Textarea
                                            value={work.description}
                                            onChange={(e) => {
                                                const newWorkExperience = [...workExperience];
                                                newWorkExperience[index].description = e.target.value;
                                                setWorkExperience(newWorkExperience);
                                            }}
                                            placeholder="Describe tus responsabilidades y logros"
                                            required
                                        />
                                    </FormControl>
                                </Box>
                            ))}
                            <Button onClick={handleAddWorkExperience} colorScheme="blue" mb="6">
                                Agregar Experiencia Laboral
                            </Button>

                            {/* Sección de Educación */}
                            <Heading size="md" mb="4" color="cyan.600">
                                <Icon as={FaGraduationCap} mr="2" /> Educación
                            </Heading>
                            {education.map((edu, index) => (
                                <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                    <FormControl mb="2">
                                        <FormLabel>Institución</FormLabel>
                                        <Input
                                            value={edu.institution}
                                            onChange={(e) => {
                                                const newEducation = [...education];
                                                newEducation[index].institution = e.target.value;
                                                setEducation(newEducation);
                                            }}
                                            placeholder="Nombre de la institución"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl mb="2">
                                        <FormLabel>Grado o Título</FormLabel>
                                        <Input
                                            value={edu.degree}
                                            onChange={(e) => {
                                                const newEducation = [...education];
                                                newEducation[index].degree = e.target.value;
                                                setEducation(newEducation);
                                            }}
                                            placeholder="Título obtenido"
                                            required
                                        />
                                    </FormControl>
                                    <SimpleGrid columns={2} spacing={4}>
                                        <FormControl mb="2">
                                            <FormLabel>Año de Inicio</FormLabel>
                                            <Input
                                                type="number"
                                                value={edu.startYear}
                                                onChange={(e) => {
                                                    const newEducation = [...education];
                                                    newEducation[index].startYear = e.target.value;
                                                    setEducation(newEducation);
                                                }}
                                                placeholder="Ej: 2015"
                                                required
                                            />
                                        </FormControl>
                                        <FormControl mb="2">
                                            <FormLabel>Año de Fin</FormLabel>
                                            <Input
                                                type="number"
                                                value={edu.endYear}
                                                onChange={(e) => {
                                                    const newEducation = [...education];
                                                    newEducation[index].endYear = e.target.value;
                                                    setEducation(newEducation);
                                                }}
                                                placeholder="Ej: 2019"
                                                required
                                            />
                                        </FormControl>
                                    </SimpleGrid>
                                </Box>
                            ))}
                            <Button onClick={handleAddEducation} colorScheme="blue" mb="6">
                                Agregar Educación
                            </Button>

                            {/* Sección de Certificaciones */}
                            <Heading size="md" mb="4" color="cyan.600">
                                <Icon as={FaCertificate} mr="2" /> Certificaciones
                            </Heading>
                            {certifications.map((cert, index) => (
                                <Box key={index} mb="4" p="4" bg="gray.50" borderRadius="md">
                                    <FormControl mb="2">
                                        <FormLabel>Nombre de la Certificación</FormLabel>
                                        <Input
                                            value={cert.name}
                                            onChange={(e) => {
                                                const newCertifications = [...certifications];
                                                newCertifications[index].name = e.target.value;
                                                setCertifications(newCertifications);
                                            }}
                                            placeholder="Nombre de la certificación"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl mb="2">
                                        <FormLabel>Institución</FormLabel>
                                        <Input
                                            value={cert.institution}
                                            onChange={(e) => {
                                                const newCertifications = [...certifications];
                                                newCertifications[index].institution = e.target.value;
                                                setCertifications(newCertifications);
                                            }}
                                            placeholder="Institución que emitió la certificación"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl mb="2">
                                        <FormLabel>Fecha de Obtención</FormLabel>
                                        <Input
                                            type="date"
                                            value={cert.date}
                                            onChange={(e) => {
                                                const newCertifications = [...certifications];
                                                newCertifications[index].date = e.target.value;
                                                setCertifications(newCertifications);
                                            }}
                                            required
                                        />
                                    </FormControl>
                                </Box>
                            ))}
                            <Button onClick={handleAddCertification} colorScheme="blue" mb="6">
                                Agregar Certificación
                            </Button>

                            <Button type="submit" colorScheme="cyan" isLoading={loading} width="full">
                                Crear Perfil
                            </Button>
                        </form>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default CreateProfile;
