import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth(); // Get user and loading state from AuthContext
    const location = useLocation(); // To redirect back after login

    // If AuthContext is still loading the user state, don't decide yet
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
                <p className="text-xl text-gray-600 animate-pulse">Checking authentication...</p>
            </div>
        );
    }

    // 1. Check if user is logged in
    if (!user) {
        console.log("ProtectedRoute: Not logged in, redirecting to /admin/login");
        // User not logged in, redirect to login page, remembering the original path
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // 2. Check if user has an allowed role
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log(`ProtectedRoute: User role (${user.role}) not allowed. Required: ${allowedRoles.join(', ')}`);
        // User is logged in but doesn't have the required role, redirect to unauthorized
        return <Navigate to="/unauthorized" replace />;
    }

    // User is logged in and has the required role, render the child routes
    console.log(`ProtectedRoute: User (${user.username}, Role: ${user.role}) is authorized.`);
    return <Outlet />; // Renders the nested routes
};

export default ProtectedRoute;