import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // --- Declare logout first ---
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/admin/login'); // Redirect to login page after logout
    }, [navigate]);

    // --- Now declare getUserFromToken (it depends on nothing, or potentially logout for invalid tokens) ---
    const getUserFromToken = useCallback((tkn) => {
        if (tkn) {
            try {
                const decoded = jwtDecode(tkn);
                // Basic check for token expiration
                if (decoded.exp * 1000 < Date.now()) {
                    console.warn("Token expired.");
                    // No need to call logout here, the useEffect or authFetch will handle it
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
            // Optionally navigate to dashboard or home on successful login
        } else {
            console.error("Login failed: Could not decode user from token.");
            logout(); // If token is provided but invalid/expired, force logout
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
                logout(); // Clear invalid/expired token from storage and state
            }
        }
        setLoading(false); // Set loading to false once initial auth check is complete
    }, [getUserFromToken, logout]); // Dependencies for useEffect

    // --- Now declare authFetch (it depends on logout and getUserFromToken) ---
    const authFetch = useCallback(async (url, options = {}) => {
        // VITE_API_URL should now include '/api'
        const baseUrl = import.meta.env.VITE_API_URL;
        if (!baseUrl) {
            console.error("Error: VITE_API_URL is not defined in your .env file!");
            throw new Error("API base URL is not configured.");
        }

        // `fullUrl` will now correctly be `https://blog-client-601b.onrender.com/api/posts?category=technology`
        const fullUrl = `${baseUrl}${url}`;

        const currentToken = localStorage.getItem('token');
        // If there's no token, or it's invalid/expired, force logout
        if (!currentToken || !getUserFromToken(currentToken)) {
            console.warn("Authentication required or token invalid/expired for authFetch. Forcing logout.");
            logout();
            throw new Error('No valid authentication token found. Please log in.');
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
                    logout(); // Force logout on auth/authz failure
                    const authError = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                    authError.status = response.status;
                    authError.data = errorData;
                    throw authError;
                }
                // For any other HTTP errors (e.g., 404, 500, etc.)
                const httpError = new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                httpError.status = response.status;
                httpError.data = errorData;
                throw httpError;
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                // Handle cases where the response might not be JSON (e.g., 204 No Content for DELETE)
                return {};
            }

        } catch (error) {
            console.error('authFetch caught error:', error);
            // Re-throw the error so calling components can handle it
            throw error;
        }
    }, [logout, getUserFromToken]); // Dependencies for authFetch

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token, // True if user and token exist
        userRole: user?.role, // Safely access user role
        loading, // Expose loading state
        login,
        logout,
        authFetch,
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Only render children if authentication check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};