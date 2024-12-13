import React, { useState } from "react";
import './login_register.css';
import { useNavigate } from 'react-router-dom';
import { login, refrehToken, register, verify, resend_code, forgotPassword, resetPassword } from "../../services/user_services/auth";
import LoginForm from "./auth_component/login_form";
import RegisterForm from "./auth_component/register_form";
import ForgotPasswordForm from "./auth_component/forgotPassword_form";
import ValidationForm from "./auth_component/validation_form";
import ResetPasswordForm from "./auth_component/resetPassword_form";

// Xử lý refreshtoken
export const handleRefreshToken = async () => {
    try {
        const currentRefreshToken = localStorage.getItem('refresh_token');
        const result = await refrehToken(currentRefreshToken);
        if (result) {
            localStorage.setItem('access_token', result.access_token);
            localStorage.setItem('refresh_token', result.refresh_token);
        }
    } catch (error) {
        console.error(error);
    }
}

const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [validationType, setValidationType] = useState('')

    const navigate = useNavigate();

    const resetFields = () => {
        setEmail('');
        setPassword('');
        setConfirmpassword('');
        setName('');
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
    //xử lý login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const result = await login(email.trim(), password);
            if (result) {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('refresh_token', result.refresh_token);
                localStorage.setItem('user_info', JSON.stringify(result.user));
                navigate('/home');
            }
        } catch (err) {
            setError('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin')
        } finally {
            setLoading(false);
        }
    };
    //xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('')
        try {
            setLoading(true);
            const result = await register(email.trim(), password, name.trim(), dob, gender, address, phone_number);
            if (result) {
                localStorage.setItem('user_info', JSON.stringify(result.user));
                localStorage.setItem('confirm_token', result.confirm_token);
                setAction('validation-active');
                setValidationType('verify-email');
            }
        } catch (err) {
            setError('Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };
    //xử lý confirm email
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const confirmtoken = localStorage.getItem('confirm_token');
            const result = await verify(confirmtoken, code, validationType);
            if (result) {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('refresh_token', result.refresh_token);
                if (validationType === 'verify-email') {
                    setAction('');
                } else if (validationType === 'validate-reset-code') {
                    setAction('resetpassword-active');
                }
            }
        } catch (error) {
            console.log("error", error);
            setError('Mã xác thực không chính xác')
        } finally {
            setLoading(false);
        }
    }
    //xử lý resend mã xác thực
    const handleResend = async () => {
        setError('');
        try {
            setLoading(true);
            const result= validationType==='verify-email'? await resend_code(email.trim()): await forgotPassword(email.trim());
            if (result) {
                localStorage.setItem('confirm_token', result.confirm_token);
            }
        } catch (error) {
            console.log('Gửi lại mã xác thực thất bại', error);
        } finally {
            setLoading(false);
        }
    }
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const result = await forgotPassword(email.trim());
            if (result) {
                localStorage.setItem('confirm_token', result.confirm_token);
                console.log('Gửi yêu cầu thành công');
                setAction('validation-active');
                setValidationType('validate-reset-code')
            }
        } catch (err) {
            setError('Gửi yêu cầu thất bại, vui lòng kiểm tra lại email của bạn');
        } finally {
            setLoading(false);
        }

    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmpassword) {
            setError('Kiểm tra lại mật khẩu');
        } else {
            try {
                const tempAccessToken = localStorage.getItem('confirm_token');
                setLoading(true);
                const result = await resetPassword(password, tempAccessToken);
                if (result) {
                    console.log('Thành công');
                    setAction('');
                }
            } catch (err) {
                setError('Đổi mật khẩu thất bại');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login_register-page">
            <div className={`wrapper ${action}`}>
                {action === '' && (
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
                        name={name}
                        dob={dob}
                        gender={gender}
                        phone_number={phone_number}
                        address={address}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setName={setName}
                        setDob={setDob}
                        setGender={setGender}
                        setPhonenumber={setPhonenumber}
                        setAddress={setAddress}
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
                        handleVerifyEmail={handleVerifyEmail}
                        handleResend={handleResend}
                        validationType={validationType}
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