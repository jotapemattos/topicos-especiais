import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError('');

        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const data = await response.data;
            const token = data.accessToken;
            
            // Use the login function from AuthContext
            login(token);
            
            // Navigate to dashboard after successful login
            navigate("/areaMedico");
        } catch (error) {
            setError(error.response?.data?.message || 'Erro durante o login. Por favor, tente novamente.');
        }
    };
    

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <div className="login-icon">
                        <div className="circle">
                            <div className="user-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.327 0-10 1.666-10 5v3h20v-3c0-3.334-6.673-5-10-5z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        {error && <div className="error-message">{error}</div>}
                        
                        <label htmlFor="email">EMAIL:</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">SENHA:</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">Acessar</button>
                    </form>
                </div>
                <div className="placeholder-box"></div>
            </div>
        </div>
    );
}

export default Login;