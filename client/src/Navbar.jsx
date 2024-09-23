import React from 'react';
import { Box, Flex, Button, useColorModeValue, Icon } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaUserEdit, FaSignOutAlt } from 'react-icons/fa'; // Importar íconos de react-icons

function Navbar({ onLogout }) {
    const navbarBg = useColorModeValue('white', 'gray.800');
    const navbarBorder = useColorModeValue('gray.200', 'gray.700');
    const buttonVariant = useColorModeValue('outline');
    const navigate = useNavigate();


    return (
        <Box bg={navbarBg} borderBottomWidth="1px" borderColor={navbarBorder} shadow="sm">
            <Flex justify="space-between" align="center" maxW="1000px" mx="auto" p="4">
                <Button onClick={() => {navigate("/candidate-dashboard") }} variant="link" color="cyan.500" fontWeight="bold" fontSize="2xl">
                    Talent[IN]
                </Button>
                <Flex gap="4">
                    <Button onClick={() => {}} leftIcon={<FaFileAlt />} colorScheme="cyan" variant={buttonVariant}>
                        Mis Postulaciones
                    </Button>
                    <Button onClick={() => {navigate("/candidate/edit-profile")}} leftIcon={<FaUserEdit />} colorScheme="blue" variant={buttonVariant}>
                        Actualizar Perfil
                    </Button>
                    <Button leftIcon={<FaSignOutAlt />} colorScheme="red" onClick={onLogout}>
                        Cerrar Sesión
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Navbar;
