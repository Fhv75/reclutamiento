import { Box, Flex, Heading, Text, Button, Stack, Image, Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'react-router-dom';

function HomePage() {
    return (
        <>
            {/* Navbar */}
            <Flex as="nav" bg="teal" color="white" p="4" justify="space-between" align="center">
                <Heading size="lg">Fundación Ingoude</Heading>
                <Stack direction="row" spacing="4">
                    <Link href="#about" color="white">Nosotros</Link>
                    <Link href="#programs" color="white">Programas</Link>
                    <Link href="#contact" color="white">Contacto</Link>
                    <Link as={RouterLink} to="/auth" color="white">Trabaja Con Nosotros</Link>
                </Stack>
            </Flex>

            {/* Banner */}
            <Box
                position="relative"
                bgImage="url('https://images.unsplash.com/photo-1498050108023-c5249f4df085')"
                bgPos="center"
                bgSize="cover"
                h="80vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="white"
            >
                {/* Overlay oscuro */}
                <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="blackAlpha.700" />
                <Box textAlign="center" zIndex="1">
                    <Heading size="2xl" mb="4">Innovando el Futuro</Heading>
                    <Text fontSize="xl">Empoderando startups y emprendedores para construir un mañana más brillante</Text>
                    <Button as={RouterLink} to="/auth" mt="6" colorScheme="teal" size="lg">Trabaja con Nosotros</Button>
                </Box>
            </Box>

            {/* About Section */}
            <Box id="about" py="16" px="8" textAlign="center">
                <Heading mb="6">Sobre la Fundación Ingoude</Heading>
                <Text fontSize="lg" maxW="800px" mx="auto">
                    La Fundación Ingoude está dedicada a fomentar la innovación y apoyar a emprendedores en todo el mundo.
                    A través de nuestras incubadoras, aceleradoras y programas educativos, ayudamos a convertir ideas en negocios
                    impactantes que moldean el futuro de la tecnología, la sostenibilidad y el desarrollo comunitario.
                </Text>
            </Box>

            {/* Programs Section */}
            <Box id="programs" py="16" px="8" bg="gray.100">
                <Heading mb="10" textAlign="center">Nuestros Programas</Heading>
                <Flex justify="space-around" wrap="wrap">
                    <Box bg="white" p="6" shadow="md" borderRadius="md" maxW="400px" mb="8">
                        <Image src="https://images.unsplash.com/photo-1556740749-887f6717d7e4" alt="Programa Incubadora" borderRadius="md" mb="4" />
                        <Heading size="md" mb="4">Incubadora de Startups</Heading>
                        <Text>Ofrecemos mentoría, espacio de trabajo y acceso a financiamiento para convertir ideas en negocios escalables.</Text>
                    </Box>
                    <Box bg="white" p="6" shadow="md" borderRadius="md" maxW="400px" mb="8">
                        <Image src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" alt="Programa Aceleradora" borderRadius="md" mb="4" />
                        <Heading size="md" mb="4">Aceleradora de Negocios</Heading>
                        <Text>Impulsamos el crecimiento de startups conectándolas con expertos de la industria, inversionistas y recursos clave.</Text>
                    </Box>
                    <Box bg="white" p="6" shadow="md" borderRadius="md" maxW="400px" mb="8">
                        <Image src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4" alt="Programas Educativos" borderRadius="md" mb="4" />
                        <Heading size="md" mb="4">Programas Educativos</Heading>
                        <Text>Ofrecemos talleres y cursos sobre desarrollo empresarial, tecnología y liderazgo para ayudar a los emprendedores a tener éxito.</Text>
                    </Box>
                </Flex>
            </Box>

            {/* Contact Section */}
            <Box id="contact" py="16" px="8" textAlign="center">
                <Heading mb="6">Contáctanos</Heading>
                <Text fontSize="lg" mb="6">¿Interesado en colaborar con nosotros o aprender más sobre nuestros programas?</Text>
                <Button colorScheme="teal" size="lg">Contáctanos</Button>
            </Box>

            {/* Footer */}
            <Flex as="footer" bg="teal" color="white" p="4" justify="center">
                <Text>&copy; 2024 Fundación Ingoude. Todos los derechos reservados.</Text>
            </Flex>
        </>
    );
}

export default HomePage;
