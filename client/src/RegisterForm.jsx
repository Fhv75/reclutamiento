import { Box, FormControl, FormLabel, Input, Button, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "./config"; // Asegúrate de que esta ruta sea correcta

function RegisterForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();

    const validateEmail = (email) => {
        // Valida el formato del correo electrónico usando una expresión regular
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        const newErrors = {};
        if (!name) {
            newErrors.name = "El nombre completo es obligatorio.";
        }
        if (!email) {
            newErrors.email = "El correo electrónico es obligatorio.";
        } else if (!validateEmail(email)) {
            newErrors.email = "Formato de correo electrónico no válido.";
        }
        if (!password) {
            newErrors.password = "La contraseña es obligatoria.";
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            const { token, user } = response.data;
            
            // Almacenar token y rol en el local storage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', user.role);

            toast({
                title: "Registro exitoso.",
                description: "Tu cuenta ha sido creada. Ahora puedes crear tu perfil.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Llamar a la función onSuccess pasada como prop para cambiar la vista
            if (onSuccess) onSuccess();

        } catch (error) {
            console.log(error)
            let errorMessage = "Ha ocurrido un error. Inténtalo de nuevo.";
            if (error.response) {
                // Error de backend
                errorMessage = error.response.data.message || errorMessage;
            } else if (error.request) {
                // Error de red
                errorMessage = "No se pudo conectar con el servidor. Revisa tu conexión a Internet.";
            }
            toast({
                title: "Error en el registro.",
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
        <Box as="form" onSubmit={handleRegister}>
            <FormControl mb="4" isInvalid={errors.name}>
                <FormLabel>Nombre Completo</FormLabel>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isDisabled={loading}
                    isInvalid={errors.name}
                />
                {errors.name && <Text color="red.500" mt="1">{errors.name}</Text>}
            </FormControl>
            <FormControl mb="4" isInvalid={errors.email}>
                <FormLabel>Correo Electrónico</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isDisabled={loading}
                    isInvalid={errors.email}
                />
                {errors.email && <Text color="red.500" mt="1">{errors.email}</Text>}
            </FormControl>
            <FormControl mb="4" isInvalid={errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={loading}
                    isInvalid={errors.password}
                />
                {errors.password && <Text color="red.500" mt="1">{errors.password}</Text>}
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full" isLoading={loading} isDisabled={loading}>
                Registrarse
            </Button>
        </Box>
    );
}

export default RegisterForm;
