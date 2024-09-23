import { Box, Flex, Heading, Text, Button, Image } from "@chakra-ui/react";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from './config';
// import IngoudeLogo from './imagen.png'; // Logo de Ingoude Foundation
// import TalentInLogo from './talentInLogo.png'; // Logo de TalentIN

function AuthSkeleton() {
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();

    // Manejar la autenticación exitosa
    const handleAuthSuccess = () => {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
            navigate('/admin-dashboard');
        } else if (userRole === 'recruiter') {
            navigate('/recruiter-dashboard');
        } else {
            navigate('/candidate-dashboard');
        }
    };

    // Función para manejar el éxito del registro
    const handleRegisterSuccess = async () => {
        try {
            // Obtener el token del almacenamiento local
            const token = localStorage.getItem('authToken');

            // Verificar si el perfil del candidato está completo
            const response = await axios.get(`${API_URL}/candidate/profile`, {
                headers: { Authorization: token }
            });

            if (response.data && response.data.bio) {
                // Si el perfil está completo, redirigir al CandidateDashboard
                navigate('/candidate-dashboard');
            } else {
                // Si el perfil no está completo, redirigir a la página de creación de perfil
                navigate('/candidate/create-profile');
            }
        } catch (error) {
            console.error("Error al verificar el perfil del candidato:", error);
            navigate('/candidate/create-profile'); // Redirigir a crear perfil por defecto
        }
    };

    return (
        <Flex h="100vh" justify="center" align="center" bg="gray.100">
            <Box bg="white" p="8" shadow="md" borderRadius="md" width="400px">
                {/* Sección del logo y título */}
                <Flex direction="column" align="center" mb="6">
                    {/* <Image src={TalentInLogo} alt="Logo TalentIN" boxSize="60px" mb="2" /> */}
                    <Heading size="lg" color="cyan.600">TalentIN</Heading>
                    <Text color="gray.500" fontSize="sm">Powered by Ingoude Foundation</Text>
                </Flex>

                {/* Título del formulario */}
                <Heading mb="4" textAlign="center">{showLogin ? 'Iniciar Sesión' : 'Registro'}</Heading>

                {/* Formulario */}
                {showLogin ? (
                    <LoginForm onSuccess={handleAuthSuccess}/>
                ) : (
                    <RegisterForm onSuccess={handleRegisterSuccess} />
                )}

                {/* Toggle entre los formularios */}
                <Text textAlign="center" mt="4">
                    {showLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
                    <Button variant="link" colorScheme="cyan" onClick={() => setShowLogin(!showLogin)}>
                        {showLogin ? 'Regístrate' : 'Inicia sesión'}
                    </Button>
                </Text>

                {/* Logo de Ingoude Foundation en el pie del componente */}
                <Flex justify="center" mt="8">
                    {/* <Image src={IngoudeLogo} alt="Logo Ingoude Foundation" boxSize="40px" /> */}
                </Flex>
            </Box>
        </Flex>
    );
}

export default AuthSkeleton;
