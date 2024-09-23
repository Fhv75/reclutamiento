import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ roles }) => {
    const isAuthenticated = localStorage.getItem('authToken'); // Verifica si hay un token de autenticación
    const userRole = localStorage.getItem('userRole'); // Verifica el rol del usuario

    // Si el usuario no está autenticado, redirige al login
    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    // Si el usuario no tiene el rol adecuado, redirige al login o a una página de acceso denegado
    if (!roles.includes(userRole)) {
        return <Navigate to="/auth" />;
    }

    // Si está autenticado y tiene el rol adecuado, renderiza el componente hijo
    return <Outlet />;
};

export default PrivateRoute;
