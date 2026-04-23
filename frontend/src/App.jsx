import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

/**
 * ProtectedRoute Component
 * Checks if a JWT token exists in the AuthContext.
 * If not, it redirects the user to the Login page.
 */
const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    
    // If no token is found, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Root Redirect: Send users to dashboard by default */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 2. Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* 3. Protected Private Routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* 4. Catch-all: Handle 404 - Not Found */}
                <Route 
                    path="*" 
                    element={
                        <div className="p-10 text-center">
                            <h2 className="text-xl font-bold">404: Page Not Found</h2>
                            <p>The field you are looking for doesn't exist.</p>
                            <a href="/" className="text-blue-500 underline">Go Home</a>
                        </div>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;