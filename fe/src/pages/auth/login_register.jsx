import React, { useState } from "react";
import './login_register.css';
import { useNavigate } from 'react-router-dom';
import { userlogin, userrefrehToken, userlogout, register, verify, resend_code, forgotPassword, validation, resetPassword } from "../../services/user_services/auth";
import { adminlogin, adminlogout,adminrefrehToken } from "../../services/admin_services/auth.jsx";
import LoginForm from "./auth_component/login_form";
import RegisterForm from "./auth_component/register_form";
import ForgotPasswordForm from "./auth_component/forgotPassword_form";
import ValidationForm from "./auth_component/validation_form";
import ResetPasswordForm from "./auth_component/resetPassword_form";


//kiểm tra xem 1 token hết hạn chưa?
const isTokenExpired = (token) => {
    if (!token) return true;
    // Giải mã token để lấy thời gian hết hạn (exp)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expTime = payload.exp * 1000; // chuyển thành milliseconds
    return Date.now() >= expTime; // Trả về true nếu token đã hết hạn
};
// Xử lý refreshtoken
export const handleRefreshToken = async () => {
    const currentAccessToken = localStorage.getItem('access_token');
    if(isTokenExpired(currentAccessToken)){
        try {
            const currentRefreshToken = localStorage.getItem('refresh_token');
            const isAdmin = localStorage.getItem('admin_info') ? true : false;
            const result = isAdmin? await userrefrehToken(currentRefreshToken):await adminrefrehToken(currentRefreshToken);
            if (result) {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('refresh_token', result.refresh_token);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

const LoginRegister = () => {
    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phone_number, setPhonenumber] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

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
            const result = isAdmin ? await adminlogin(email.trim(), password) : await userlogin(email.trim(), password);
            if (result) {
                if (!result.reader.is_verified) {
                    setError('Tài khoản của bạn chưa được xác thực. Vui lòng xác thực qua email.');
                    //xử lý sau
                }
                localStorage.setItem('access_token', result.accessToken);
                localStorage.setItem('refresh_token', result.refreshToken);
                if (isAdmin) {
                    localStorage.setItem('admin_info', JSON.stringify(result.admin))

                } else {
                    localStorage.setItem('reader_info', JSON.stringify(result.reader))
                }
                navigate('/home');
                alert(result.message);
            }
        } catch (err) {
            setError('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin')
        } finally {
            setLoading(false);
        }
    };
    
    
    //xử lý logout
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const isAdmin = localStorage.getItem('admin_info') ? true : false;
            const result = isAdmin? await userlogout(accessToken): await adminlogout(accessToken);
            if (result) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('reader_info');
                localStorage.removeItem('admin_info');
                alert("Đăng xuất thành công!");
                navigate('/login');
            }
        } catch (error) {
            alert('Tài khoản đã hết phiên đăng nhập trước đó');
        } 
    }
    //xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('')
        try {
            setLoading(true);
            const result = await register(email.trim(), password, name.trim(), dob, gender, address, phone_number);
            if (result) {
                localStorage.setItem('reader_info', JSON.stringify(result.reader));
                localStorage.setItem('confirm_token', result.confirm_token);
                setAction('validation-active');
                alert('User registered successfully. An email has been sent to confirm your account');
            }
        } catch (err) {
            alert('Đăng ký thất bại, vui lòng thử lại');
            setError('Đăng ký thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
            setAction('validation-active');//xóa sau
        }
    };
    //xử lý confirm email
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const confirmtoken = localStorage.getItem('confirm_token');
            const result = await verify(confirmtoken, code);
            if (result) {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('refresh_token', result.refresh_token);
                alert('Your email address was verified successfully.');
                navigate('/login');
            }
        } catch (error) {
            setError('Mã xác thực không chính xác')
        } finally {
            setLoading(false);
        }
    }
    //xử lý resend mã xác thực
    const handleResend = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            const readerInfo = JSON.parse(localStorage.getItem('reader_info'));
            const email = readerInfo ? readerInfo.email : null;
            const result = await resend_code(email);
            if (result) {
                localStorage.setItem('confirm_token', result.confirm_token);
                alert('Đã gửi lại mã xác thức tới email của bạn')
            }
        } catch (error) {
            alert('Gửi lại mã xác thực thất bại');
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
                        isAdmin={isAdmin}
                        setIsAdmin={setIsAdmin}
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
