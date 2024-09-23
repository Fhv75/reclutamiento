import { Box, FormControl, FormLabel, Input, Textarea, Button, useToast, Flex, Heading, Divider, Avatar, Icon, Stack, Text, SimpleGrid } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "./config";
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import { FaArrowLeft, FaUserEdit, FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa';

// Función para formatear las fechas al formato YYYY-MM-DD
const formatDate = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : '';
};

function EditProfile() {
    const [name, setName] = useState('');
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

    // Fetch del perfil del candidato al cargar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${API_URL}/candidate/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { bio, skills, location, phone, workExperience, education, certifications } = response.data;

                const name = response.data.user.name || '';

                // Actualizamos el estado con los datos del perfil
                setName(name);
                setBio(bio);
                setSkills(skills);
                setLocation(location);
                setPhone(phone);

                // Mapeamos las experiencias laborales para formatear las fechas
                const formattedWorkExperience = workExperience.map((work) => ({
                    ...work,
                    startDate: formatDate(work.startDate),
                    endDate: formatDate(work.endDate)
                }));

                // Mapeamos las certificaciones para formatear la fecha de obtención
                const formattedCertifications = certifications.map((cert) => ({
                    ...cert,
                    date: formatDate(cert.date)
                }));

                setWorkExperience(formattedWorkExperience || []);
                setEducation(education || []);
                setCertifications(formattedCertifications || []);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    title: "Error",
                    description: "Hubo un problema al cargar tu perfil. Por favor, intenta nuevamente.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchProfile();
    }, []);

    // Función para ir hacia atrás
    const handleGoBack = () => {
        navigate(-1); // Redirigir a la página anterior
    };

    // Manejar la actualización del perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${API_URL}/candidate/profile`,
                { name, bio, skills, location, phone, workExperience, education, certifications },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast({
                title: "Perfil actualizado",
                description: "Tu perfil ha sido actualizado exitosamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            navigate('/candidate/profile');
        } catch (error) {
            let errorMessage = "Error al actualizar el perfil.";
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
                <Stack spacing="6">
                    {/* Tarjeta de Edición de Perfil */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm">
                        <Flex justify="space-between" align="center">
                            <Flex align="center">
                                <Avatar size="lg" icon={<FaUserEdit />} />
                                <Box ml="4">
                                    <Text fontWeight="bold" fontSize="lg">Editar Perfil</Text>
                                    <Text color="gray.500">Actualiza tu información de perfil</Text>
                                </Box>
                            </Flex>
                            {/* Botón para ir atrás */}
                            <Button leftIcon={<FaArrowLeft />} onClick={handleGoBack} colorScheme="gray" variant="outline">
                                Atrás
                            </Button>
                        </Flex>
                        <Divider my="4" />

                        {/* Formulario de edición de perfil */}
                        <form onSubmit={handleUpdateProfile}>
                            <FormControl mb="4">
                                <FormLabel>Nombre Completo</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nombre completo"
                                    required
                                />
                            </FormControl>

                            <FormControl mb="4">
                                <FormLabel>Biografía</FormLabel>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Cuéntanos sobre ti..."
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

                            <Button type="submit" colorScheme="cyan" isLoading={loading} width="full">
                                Actualizar Perfil
                            </Button>
                        </form>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default EditProfile;
