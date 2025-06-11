import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // --- Declare logout first ---
    // It depends on `Maps`, so declare it using useCallback
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/admin/login');
    }, [navigate]);

    // --- Now declare getUserFromToken (it depends on nothing, or potentially logout) ---
    const getUserFromToken = useCallback((tkn) => {
        if (tkn) {
            try {
                const decoded = jwtDecode(tkn);
                // Basic check for token expiration
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn("Token expired.");
                    return null;
                }
                // Assuming your token payload includes id, username, and role
                return { id: decoded.id, name: decoded.username, role: decoded.role };
            } catch (error) {
                console.error("Error decoding token or token invalid:", error);
                return null;
            }
        }
        return null;
    }, []);

    // --- Now declare login (it depends on getUserFromToken and logout) ---
    const login = useCallback((newToken) => {
        const decodedUser = getUserFromToken(newToken);
        if (decodedUser) {
            setToken(newToken);
            setUser(decodedUser);
            localStorage.setItem('token', newToken);
        } else {
            console.error("Login failed: Could not decode user from token.");
            logout(); // Now 'logout' is defined
        }
    }, [getUserFromToken, logout]);

    // --- Now declare useEffect (it depends on getUserFromToken and logout) ---
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const decodedUser = getUserFromToken(storedToken);
            if (decodedUser) {
                setToken(storedToken);
                setUser(decodedUser);
            } else {
                console.warn("Stored token is invalid or expired. Logging out.");
                logout(); // Now 'logout' is defined
            }
        }
        setLoading(false);
    }, [getUserFromToken, logout]);

    // --- Now declare authFetch (it depends on logout and getUserFromToken) ---
    const authFetch = useCallback(async (url, options = {}) => {
        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) {
            console.error("Error: VITE_API_URL is not defined in your .env file!");
            throw new Error("API base URL is not configured.");
        }

        const fullUrl = `${baseUrl}${url}`;

        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
            console.warn("No token found for authFetch. Forcing logout.");
            logout(); // Now 'logout' is defined
            throw new Error('No authentication token found. Please log in.');
        }

        const currentDecodedUser = getUserFromToken(currentToken);
        if (!currentDecodedUser) {
            console.warn("Current token is invalid or expired during authFetch. Forcing logout.");
            logout(); // Now 'logout' is defined
            throw new Error('Authentication failed or expired. Please log in again.');
        }

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`,
        };

        try {
            const response = await fetch(fullUrl, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));

                if (response.status === 401 || response.status === 403) {
                    console.error('Authentication or Authorization failed:', errorData.message);
                    logout(); // Now 'logout' is defined
                    const authError = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    authError.status = response.status;
                    authError.data = errorData;
                    throw authError;
                }
                const httpError = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                httpError.status = response.status;
                httpError.data = errorData;
                throw httpError;
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return {};
            }

        } catch (error) {
            console.error('authFetch caught error:', error);
            throw error;
        }
    }, [logout, getUserFromToken]); // Dependencies for authFetch

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        userRole: user?.role,
        loading,
        login,
        logout,
        authFetch,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};