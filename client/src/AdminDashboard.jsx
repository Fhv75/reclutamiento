import React, { useState } from 'react';
import { Box, Text, Button, Flex, FormControl, FormLabel, Input, useToast, Collapse, Stack, Divider, Icon, Avatar } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { API_URL } from './config';
import { FaUsers, FaUserPlus, FaUserEdit, FaTrash, FaClipboardList } from 'react-icons/fa';

function AdminDashboard() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // Manejar la creación de reclutadores
    const handleCreateRecruiter = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/admin/create-recruiter`,
                { name, email, password },
                {
                    headers: {
                        Authorization: token
                    }
                }
            );

            toast({
                title: "Reclutador creado",
                description: response.data.message,
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Limpiar el formulario
            setName('');
            setEmail('');
            setPassword('');

        } catch (error) {
            let errorMessage = "Error al crear el reclutador.";
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
                    { text: 'Gestión de Usuarios', to: '#', icon: FaUsers },
                    { text: 'Crear Reclutador', to: '#', icon: FaUserPlus },
                    { text: 'Métricas de Uso', to: '#', icon: FaClipboardList }
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
                    {/* Tarjeta de Información del Administrador */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" mb="4" maxW="700px" width="100%">
                        <Flex align="center">
                            <Avatar size="lg" name="Admin" src="https://bit.ly/code-beast" />
                            <Box ml="4">
                                <Text fontWeight="bold" fontSize="lg">Administrador</Text>
                                <Text color="gray.500">Gestor Principal | Ingoude Foundation</Text>
                                <Text color="gray.500" fontSize="sm">Ciudad, País</Text>
                            </Box>
                        </Flex>
                        <Divider my="4" />
                        <Flex justify="space-between">
                            <Button leftIcon={<FaUsers />} colorScheme="teal" variant="outline" size="sm">
                                Ver Todos los Usuarios
                            </Button>
                            <Button leftIcon={<FaUserPlus />} colorScheme="blue" variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
                                {showForm ? "Cancelar" : "Crear Reclutador"}
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección para Crear Reclutador */}
                    <Collapse in={showForm} animateOpacity style={{ width: "100%" }}>
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            width="full"
                        >
                            <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="700px" width="100%">
                                <Flex align="center" mb="4">
                                    <Icon as={FaUserPlus} boxSize="6" color="cyan.500" />
                                    <Text ml="2" fontSize="lg" fontWeight="bold">Crear Nuevo Reclutador</Text>
                                </Flex>
                                <Divider mb="4" />
                                <Box as="form" onSubmit={handleCreateRecruiter} mt="4" p="4">
                                    <FormControl mb="4">
                                        <FormLabel>Nombre Completo</FormLabel>
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </FormControl>

                                    <FormControl mb="4">
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </FormControl>

                                    <FormControl mb="4">
                                        <FormLabel>Contraseña</FormLabel>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="cyan"
                                        isLoading={loading}
                                        isDisabled={loading}
                                        width="full"
                                    >
                                        Crear Reclutador
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Collapse>

                    {/* Sección de Gestión de Usuarios */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="700px" width="100%">
                        <Flex align="center" mb="4">
                            <Icon as={FaUsers} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Gestión de Usuarios</Text>
                        </Flex>
                        <Divider mb="4" />
                        <Flex direction="column" gap="4">
                            <Button leftIcon={<FaUsers />} colorScheme="teal" variant="outline" size="sm">
                                Ver Todos los Usuarios
                            </Button>
                            <Button leftIcon={<FaUserEdit />} colorScheme="blue" variant="outline" size="sm">
                                Cambiar Rol de Usuario
                            </Button>
                            <Button leftIcon={<FaTrash />} colorScheme="red" variant="outline" size="sm">
                                Eliminar Usuario
                            </Button>
                        </Flex>
                    </Box>

                    {/* Sección de Métricas */}
                    <Box bg="white" p="6" borderRadius="md" shadow="sm" maxW="700px" width="100%">
                        <Flex align="center" mb="4">
                            <Icon as={FaClipboardList} boxSize="6" color="cyan.500" />
                            <Text ml="2" fontSize="lg" fontWeight="bold">Métricas de Uso</Text>
                        </Flex>
                        <Divider mb="4" />
                        <Text>Visualiza aquí las métricas de uso de la plataforma.</Text>
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
}

export default AdminDashboard;
