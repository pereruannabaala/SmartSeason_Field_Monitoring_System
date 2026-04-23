import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=Lora:wght@600&display=swap');

  .login-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fdfbf7;
    font-family: 'Instrument Sans', sans-serif;
    color: #3e3a31;
  }

  .login-card {
    padding: 2.5rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(45, 62, 36, 0.05);
    border: 1px solid #e0dcd0;
    width: 360px;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-logo-container {
    background: #e2efd9;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    color: #4a6741;
  }

  .login-header h2 {
    font-family: 'Lora', serif;
    color: #2d3e24;
    font-size: 1.8rem;
    margin: 0;
  }

  .login-header p {
    color: #7a7363;
    font-size: 14px;
    margin-top: 8px;
  }

  .input-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .input-group label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5c574a;
    margin-bottom: 8px;
  }

  .input-field {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e0dcd0;
    background: #fdfbf7;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s;
    outline: none;
  }

  .input-field:focus {
    border-color: #4a6741;
    box-shadow: 0 0 0 3px rgba(74, 103, 65, 0.1);
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 32px;
    background: none;
    border: none;
    color: #7a7363;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .password-toggle:hover {
    color: #2d3e24;
  }

  .login-button {
    width: 100%;
    padding: 12px;
    background-color: #4a6741;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    transition: background 0.2s;
    margin-top: 1rem;
  }

  .login-button:hover {
    background-color: #3a5233;
  }
`;

// Icon Components
const SproutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10" /><path d="M10 20c5.5-2.5 8-6.4 8-10 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 3.6 2.5 7.5 8 10Z" /><path d="M13 20c.5-3 1-6.5.5-10" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (error) {
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="login-wrap">
            <style>{styles}</style>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo-container">
                        <SproutIcon />
                    </div>
                    <h2>SmartSeason</h2>
                    <p>Field Monitoring System</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            className="input-field"
                            type="text" 
                            placeholder="Enter your username"
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            className="input-field"
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button 
                            type="button"
                            className="password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    <button type="submit" className="login-button">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;