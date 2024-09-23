import React from 'react';
import { Box, Flex, Text, Button, VStack, useColorModeValue, Icon } from "@chakra-ui/react";
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ links, onLogout }) {
    const location = useLocation();
    const sidebarBg = useColorModeValue('gray.800', 'gray.900');
    const sidebarTextColor = useColorModeValue('whiteAlpha.900', 'whiteAlpha.900');
    const sidebarHighlightColor = useColorModeValue('cyan.500', 'cyan.500');

    return (
        <Box
            bg={sidebarBg}
            w="250px"
            h="100vh"
            position="fixed"
            top="0"
            left="0"
            p="6"
            color={sidebarTextColor}
            shadow="lg"
        >
            <VStack spacing="6" align="start">
                {links.map((link) => (
                    <Button
                        key={link.text}
                        as={Link}
                        to={link.to}
                        variant="ghost"
                        justifyContent="flex-start"
                        w="full"
                        color={location.pathname === link.to ? sidebarHighlightColor : sidebarTextColor}
                        leftIcon={<Icon as={link.icon} />}
                        _hover={{ bg: "gray.700" }}
                    >
                        {link.text}
                    </Button>
                ))}
                <Button colorScheme="red" w="full" onClick={onLogout}>
                    Cerrar Sesión
                </Button>
            </VStack>
        </Box>
    );
}

export default Sidebar;
