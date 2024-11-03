import React, { useState } from "react";
import './login_register.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import login from "../../services/login_api";
import register from "../../services/register_api";
import forgotPassword from "../../services/forgot_password";
import validation from "../../services/validate_code";
import resetPassword from "../../services/reset_password";

const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [username, setUsername] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const navigate = useNavigate();

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setConfirmpassword('');
        setUsername('');
        setCode('');
        setError('');
    };
    const registerLink = () => {
        resetFields();
        setAction('register-active');
    };

    const loginLink = () => {
        resetFields();
        setAction('');
    };

    const forgotPasswordLink = () => {
        resetFields();
        setAction('forgotpassword-active');
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const result = await login(email.trim(), password);
            if (result && result.token) {
                localStorage.setItem('tokenlogin', result.token);
                console.log('lưu thành công');
                navigate('/home');
            }
        } catch (err) {
            setError('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin')
        } finally {
            setLoading(false);
        }

    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('')
        try {
            setLoading(true);
            const result = await register(email.trim(), password, username.trim());
            if (result) {
                console.log('Đăng ký thành công');
            }
        } catch (err) {
            setError('Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const result = await forgotPassword(email.trim());
            if (result && result.token) {
                localStorage.setItem('tokenforgot', result.token);
                console.log('Gửi yêu cầu thành công');
                setAction('validation-active');
            }
        } catch (err) {
            setError('Gửi yêu cầu thất bại, vui lòng kiểm tra lại email của bạn');
        } finally {
            setLoading(false);
        }
        setAction('validation-active');//xóa sau
    };

    const handleValidation = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const result = await validation(code);
            if (result) {
                console.log('Mã xác thực chính xác');
                setAction('resetpassword-active');
            }
        } catch (err) {
            setError('Nhập mã xác thực thất bại');
        } finally {
            setLoading(false);
        }
        setAction('resetpassword-active'); // Chuyển sang form nhập mật khẩu mới
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        // Xử lý đặt lại mật khẩu thành công
        try {
            setLoading(true);
            const result = await resetPassword(password, confirmpassword);
            if (result) {
                console.log('Thành công');
                navigate('/home');
            }
        } catch (err) {
            setError('Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
        navigate('/home');
    };

    return (
        <div className="login_register-page">
            <div className={`wrapper ${action}`}>
                {/* Form Login */}
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

                {/* Form Register */}
                <div className="form-box register">
                    <form onSubmit={handleRegister}>
                        <h1>Registration</h1>
                        {error && (
                            <div className="error-message text-red-500 text-sm mb-4">
                                {error}
                            </div>
                        )}
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                                required />
                            <FaUser className="icon" />
                        </div>
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
                            <label>
                                <input
                                    type="checkbox"
                                    checked={agreeToTerms}
                                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    disabled={loading}
                                />
                                <span className="ml-2">
                                    I agree to the terms & conditions
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || agreeToTerms}
                            className={`${(loading || !agreeToTerms) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                        >
                            {loading ? <div className="spinner" /> : 'Register'}

                        </button>
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

                {/* Form Validation Code */}
                <div className="form-box validation">
                    <form onSubmit={handleValidation}>
                        <h1>Enter Code</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={loading}
                                required />
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
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="password" 
                                placeholder="Confirm Password"
                                value={confirmpassword}
                                onChange={(e)=>setConfirmpassword(e.target.value)} 
                                disabled={loading}
                                required />
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
