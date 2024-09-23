import React from 'react';
import { Box, Text, Button, Flex, Stack, Divider, Icon, Avatar } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { FaUsers, FaBriefcase, FaPlus, FaEdit, FaClipboardList } from 'react-icons/fa';

function RecruiterDashboard() {
    const navigate = useNavigate();
    const toast = useToast();

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
                            <Avatar size="lg" name="Juan Pérez" src="https://bit.ly/dan-abramov" />
                            <Box ml="4">
                                <Text fontWeight="bold" fontSize="lg">Juan Pérez</Text>
                                <Text color="gray.500">Reclutador de RRHH | Ingoude Foundation</Text>
                                <Text color="gray.500" fontSize="sm">Ciudad, País</Text>
                            </Box>
                        </Flex>
                        <Divider my="4" />
                        <Flex justify="space-between">
                            <Button leftIcon={<FaPlus />} colorScheme="cyan" variant="outline" size="sm">
                                Crear Nueva Oferta
                            </Button>
                            <Button leftIcon={<FaEdit />} colorScheme="blue" size="sm">
                                Editar Ofertas Existentes
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección de Ofertas de Trabajo */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="1100px" width="100%">
                        <Flex align="center" mb="4">
                            <Icon as={FaClipboardList} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Gestión de Ofertas de Trabajo</Text>
                        </Flex>
                        <Divider mb="4" />
                        <Flex direction="column" align="start" gap="4">
                            <Button colorScheme="teal" variant="outline" size="sm">
                                Ver Todas las Ofertas
                            </Button>
                            <Button colorScheme="blue" variant="outline" size="sm">
                                Crear Nueva Oferta
                            </Button>
                            <Button colorScheme="orange" variant="outline" size="sm">
                                Editar Ofertas Existentes
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección de Revisión de Candidatos */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="1100px" width="100%">
                        <Flex align="center" mb="4">
                            <Icon as={FaUsers} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Revisión de Candidatos</Text>
                        </Flex>
                        <Divider mb="4" />
                        <Text>Revisa y gestiona las postulaciones de candidatos para las ofertas de trabajo de Ingoude Foundation.</Text>
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
}

export default RecruiterDashboard;
