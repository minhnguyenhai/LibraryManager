import React from 'react';
import { FaEnvelope, FaLock } from "react-icons/fa";
import '../login_register.css';

const LoginForm = ({ email, password, setEmail, setPassword, loading, handleLogin, error, forgotPasswordLink, registerLink }) => (
    <div className="form-box login">
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            {error && <div className="error-message text-red-500">{error}</div>}
            <div className="input-box">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />
                <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox"  />Remember me</label>
                <a href="#" onClick={forgotPasswordLink}>Forgot Password ?</a>
            </div>

            <button
                type="submit"
            >
                Login
            </button>
            <div className="register-link">
                <p>
                    Don't you have an account? <a href="#" onClick={registerLink}>Register</a>
                </p>
            </div>
        </form>
    </div>
);

export default LoginForm;
