import React from 'react';
import { FaEnvelope } from "react-icons/fa";
import '../login_register.css';
const ForgotPasswordForm = ({ email, setEmail, loading, handleForgotPassword, error, loginLink }) => (
    <div className="form-box forgotpassword">
        <form onSubmit={handleForgotPassword}>
            <h1>Forgot Password</h1>
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

            <button type="submit">Verify</button>
            <div className="register-link">
                <p>
                    Remembered your password? <a href="#" onClick={loginLink}>Login</a>
                </p>
            </div>
        </form>
    </div>
);

export default ForgotPasswordForm;
