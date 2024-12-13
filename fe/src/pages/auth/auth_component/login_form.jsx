import React from 'react';
import { FaEnvelope, FaLock } from "react-icons/fa";
import '../login_register.css';

const LoginForm = ({ email, password, setEmail,loading, setPassword, handleLogin, error, forgotPasswordLink, registerLink }) => (
    <div className="form-box login">
        <form onSubmit={handleLogin}>
            <h1>Đăng nhập</h1>
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
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <FaLock className="icon" />
            </div>
            <div className="remember-forgot">
                <a href="#" onClick={forgotPasswordLink}>Quên mật khẩu?</a>
            </div>

            <button
                type="submit"
                disabled={loading}
                
            >
                {loading ? "Loading..." : "Đăng nhập"}
            </button>
            <div className="register-link">
                <p>
                    Bạn chưa có tài khoản? <a href="#" onClick={registerLink}>Đăng ký</a>
                </p>
            </div>
        </form>
    </div>
);

export default LoginForm;
