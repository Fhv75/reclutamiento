import React, { useState } from 'react';
import { Box, Text, Button, Flex, Divider, Icon, Collapse, Badge } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

function JobCard({ job, onEdit, onDisable, onEnable, showActions = true }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Box
            bg={job.status === 'disabled' ? 'gray.300' : 'white'}
            p="6"
            borderRadius="md"
            shadow="md"
            mb="4"
        >
            <Flex justify="space-between" align="center">
                <Box>
                    <Text fontWeight="bold" fontSize="lg">{job.title}</Text>
                    <Text color="gray.600" mt="1">{job.location}</Text>
                    {job.status === 'disabled' && (
                        <Badge colorScheme="red" mt="2">Deshabilitada</Badge>
                    )}
                </Box>
                {showActions && (
                    <Flex gap="2">
                        {job.status === 'active' ? (
                            <>
                                <Button size="sm" colorScheme="blue" leftIcon={<FaEdit />} onClick={() => onEdit(job._id)}>
                                    Editar
                                </Button>
                                <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} onClick={() => onDisable(job._id)}>
                                    Deshabilitar
                                </Button>
                            </>
                        ) : (
                            <Button size="sm" colorScheme="green" leftIcon={<FaCheck />} onClick={() => onEnable(job._id)}>
                                Habilitar
                            </Button>
                        )}
                    </Flex>
                )}
            </Flex>

            <Divider my="4" />

            <Text noOfLines={isExpanded ? undefined : 2} color="gray.700">
                {job.description}
            </Text>

            <Collapse in={isExpanded}>
                <Box mt="4">
                    <Text fontWeight="bold" color="gray.700">Requisitos:</Text>
                    <Text color="gray.600" mt="1">{job.requirements.join(', ')}</Text>
                </Box>
            </Collapse>

            <Button
                size="sm"
                variant="link"
                colorScheme="cyan"
                mt="4"
                onClick={toggleExpansion}
                rightIcon={isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            >
                {isExpanded ? 'Ver menos' : 'Ver más'}
            </Button>
        </Box>
    );
}

export default JobCard;
