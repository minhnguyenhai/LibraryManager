import React from 'react';
import { FaEnvelope } from "react-icons/fa";
import '../login_register.css';
const ForgotPasswordForm = ({ email, setEmail, loading, handleForgotPassword, error, loginLink }) => (
    <div className="form-box forgotpassword">
        <form onSubmit={handleForgotPassword}>
            <h1>Quên mật khẩu</h1>
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

            <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Xác nhận"}
            </button>
            <div className="register-link">
                <p>
                    Bạn đã nhớ mật khẩu? <a href="#" onClick={loginLink}>Login</a>
                </p>
            </div>
        </form>
    </div>
);

export default ForgotPasswordForm;
