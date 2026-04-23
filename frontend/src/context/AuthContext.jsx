import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const login = async (username, password) => {
    // We use the environment variable here
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const res = await axios.post(`${API_URL}/api/token/`, { username, password });
        
        const accessToken = res.data.access;
        
        const userData = { 
            username, 
            role: res.data.is_staff ? 'admin' : 'agent' 
        }; 

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};