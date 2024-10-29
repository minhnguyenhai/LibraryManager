import React, { useState } from "react";
import './login_register.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
    const [action, setAction] = useState(''); // Dùng để điều khiển trạng thái của wrapper
    const navigate = useNavigate();

    const registerLink = () => {
        setAction('register-active');
    };

    const loginLink = () => {
        setAction('');
    };

    const forgotPasswordLink = () => {
        setAction('forgotpassword-active');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    const handleRegister = (e) => {
        e.preventDefault();
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        // Giả sử xử lý quên mật khẩu thành công
        setAction('validation-active'); // Chuyển sang form nhập mã code
    };

    const handleValidation = (e) => {
        e.preventDefault();
        setAction('resetpassword-active'); // Chuyển sang form nhập mật khẩu mới
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        // Xử lý đặt lại mật khẩu thành công
        navigate('/home');
    };

    return (
        <div className="login_register-page">
            <div className={`wrapper ${action}`}>
                {/* Form Login */}
                <div className="form-box login">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Username" required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Password" required />
                            <FaLock className="icon" />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" />Remember me</label>
                            <a href="#" onClick={forgotPasswordLink}>Forgot password</a>
                        </div>

                        <button type="submit">Login</button>
                        <div className="register-link">
                            <p>
                                Don't have an account? <a href="#" onClick={registerLink}>Register</a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Form Register */}
                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input type="username" placeholder="Username" required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required />
                            <FaEnvelope className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Password" required />
                            <FaLock className="icon" />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" />I agree to the terms & conditions</label>
                        </div>

                        <button type="submit">Register</button>
                        <div className="register-link">
                            <p>
                                Already have an account? <a href="#" onClick={loginLink}>Login</a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Form Forgot Password */}
                <div className="form-box forgotpassword">
                    <form onSubmit={handleForgotPassword}>
                        <h1>Forgot Password</h1>
                        <div className="input-box">
                            <input type="email" placeholder="Email" required />
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

                {/* Form Validation Code */}
                <div className="form-box validation">
                    <form onSubmit={handleValidation}>
                        <h1>Enter Code</h1>
                        <div className="input-box">
                            <input type="text" placeholder="Enter code" required />
                        </div>

                        <button type="submit">Submit</button>
                        <div className="register-link">
                            <p>
                                Didn't receive a code? <a href="#" onClick={forgotPasswordLink}>Resend</a>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Form Reset Password */}
                <div className="form-box resetpassword">
                    <form onSubmit={handleResetPassword}>
                        <h1>Reset Password</h1>
                        <div className="input-box">
                            <input type="password" placeholder="New Password" required />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <input type="password" placeholder="Confirm Password" required />
                            <FaLock className="icon" />
                        </div>
                        <button type="submit">Reset Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
