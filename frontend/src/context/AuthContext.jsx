import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const login = async (username, password) => {
        const res = await axios.post('http://localhost:8000/api/token/', { username, password });
        
        const accessToken = res.data.access;
        
        // Use the data from your backend. 
        // If your backend sends 'is_staff', use that to set the role.
        const userData = { 
            username, 
            // Logic: if is_staff is true, they are an 'admin' (Coordinator), 
            // otherwise they are an 'agent' (Field Agent).
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