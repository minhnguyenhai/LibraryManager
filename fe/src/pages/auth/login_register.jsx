import React, { useState } from "react";
import './login_register.css';
import { useNavigate } from 'react-router-dom';
import login from "../../services/login_api";
import register from "../../services/register_api";
import forgotPassword from "../../services/forgot_password";
import validation from "../../services/validate_code";
import resetPassword from "../../services/reset_password";
import LoginForm from "./auth_component/login_form";
import RegisterForm from "./auth_component/register_form";
import ForgotPasswordForm from "./auth_component/forgotPassword_form";
import ValidationForm from "./auth_component/validation_form";
import ResetPasswordForm from "./auth_component/resetPassword_form";

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
        setAction('validation-active');
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
        setAction('resetpassword-active');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
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
    };

    return (
        <div className="login_register-page">
            <div className={`wrapper ${action}`}>
                {action === '' &&  (
                    <LoginForm
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        loading={loading}
                        error={error}
                        handleLogin={handleLogin}
                        forgotPasswordLink={forgotPasswordLink}
                        registerLink={registerLink}
                    />
                )}
                {action === 'register-active' && (
                    <RegisterForm
                        email={email}
                        password={password}
                        username={username}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setUsername={setUsername}
                        loading={loading}
                        error={error}
                        agreeToTerms={agreeToTerms}
                        setAgreeToTerms={setAgreeToTerms}
                        handleRegister={handleRegister}
                        loginLink={loginLink}
                    />
                )}
                {action === 'forgotpassword-active' && (
                    <ForgotPasswordForm
                        email={email}
                        setEmail={setEmail}
                        loading={loading}
                        error={error}
                        handleForgotPassword={handleForgotPassword}
                        loginLink={loginLink}
                    />
                )}
                {action === 'validation-active' && (
                    <ValidationForm
                        code={code}
                        setCode={setCode}
                        loading={loading}
                        error={error}
                        handleValidation={handleValidation}
                        forgotPasswordLink={forgotPasswordLink}
                    />
                )}
                {action === 'resetpassword-active' && (
                    <ResetPasswordForm
                        password={password}
                        confirmpassword={confirmpassword}
                        setPassword={setPassword}
                        setConfirmpassword={setConfirmpassword}
                        loading={loading}
                        error={error}
                        handleResetPassword={handleResetPassword}
                    />
                )}
            </div>
        </div>
    );
};

export default LoginRegister;
