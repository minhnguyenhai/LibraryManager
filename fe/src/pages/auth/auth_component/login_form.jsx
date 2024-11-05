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
                    disabled={loading}
                    required />
                <FaEnvelope className="icon" />
            </div>
            <div className="input-box">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required />
                <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox" disabled={loading} />Remember me</label>
                <a href="#" onClick={forgotPasswordLink}>Forgot password</a>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? <div className="spinner" /> : 'Login'}
            </button>
            <div className="register-link">
                <p>
                    Don't have an account? <a href="#" onClick={registerLink}>Register</a>
                </p>
            </div>
        </form>
    </div>
);

export default LoginForm;
