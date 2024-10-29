// JobExplorer.jsx
import React, { useState, useEffect } from 'react';
import { Box, Text, Input, Flex, Divider, Select, Stack, useToast } from "@chakra-ui/react";
import axios from 'axios';
import JobCard from './JobCard';
import { API_URL } from './config';

function JobExplorer() {
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const toast = useToast();

    useEffect(() => {
        // Fetch de todas las ofertas de trabajo
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${API_URL}/job/list`);
                // Filtrar ofertas para mostrar solo las activas
                const activeJobs = response.data.filter(job => job.status === 'active');
                setJobs(activeJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                toast({
                    title: "Error",
                    description: "Hubo un problema al cargar las ofertas de trabajo.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };
        fetchJobs();
    }, []);

    // Función para buscar y filtrar ofertas
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
        return matchesSearch && matchesLocation;
    });

    return (
        <Box bg="white" p="6" borderRadius="md" shadow="sm">
            <Flex align="center" mb="4">
                <Text fontSize="lg" fontWeight="bold">Explorar Ofertas de Trabajo</Text>
            </Flex>
            <Divider mb="4" />

            {/* Controles de Búsqueda y Filtro */}
            <Stack spacing="4" mb="6">
                <Input
                    placeholder="Buscar por título de la oferta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select
                    placeholder="Filtrar por ubicación"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                >
                    <option value="remoto">Remoto</option>
                    <option value="ciudad">Ciudad</option>
                    {/* Aquí puedes añadir más opciones si deseas */}
                </Select>
            </Stack>

            {/* Listado de Ofertas de Trabajo */}
            <Box>
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} showActions={false} />
                    ))
                ) : (
                    <Text>No se encontraron ofertas de trabajo.</Text>
                )}
            </Box>
        </Box>
    );
}

export default JobExplorer;
