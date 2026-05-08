import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = 'http://localhost/cineverse-pro/backend/api/';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedUser = localStorage.getItem('cineverse_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error('Auth check failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(API_URL + 'login.php', { email, password });
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem('cineverse_user', JSON.stringify(userData));
                return { success: true, user: userData };
            } else {
                setError(response.data.error);
                return { success: false, error: response.data.error };
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Login failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            const response = await axios.post(API_URL + 'register.php', { name, email, password });
            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                localStorage.setItem('cineverse_user', JSON.stringify(userData));
                return { success: true, user: userData };
            } else {
                setError(response.data.error);
                return { success: false, error: response.data.error };
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const logout = async () => {
        try {
            await axios.get(API_URL + 'logout.php');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('cineverse_user');
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
