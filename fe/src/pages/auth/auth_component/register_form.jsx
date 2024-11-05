import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import '../login_register.css';
import { BsFillTelephoneFill } from "react-icons/bs";
import Select from 'react-select';
const RegisterForm = ({ email, password, username, setEmail, setPassword, setUsername, loading, handleRegister, error, agreeToTerms, setAgreeToTerms, loginLink }) => {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    // Lấy danh sách tỉnh từ API

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/')
            .then(response => response.json())
            .then(data => {
                // Chuyển đổi dữ liệu thành định dạng { value, label }
                setProvinces(data.map(province => ({
                    value: province.code,
                    label: province.name,
                    districts: province.districts || [] // Thêm danh sách huyện nếu có
                })));
            })
            .catch(error => console.error('Error fetching provinces:', error));
    }, []);


    return (
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
                <div className="input-box">
                    <input
                        type="date"
                        placeholder="Date of birth"
                        disabled={loading}
                        required />
                </div>
                <div className="gender-box">
                    <span>Gender</span>
                    <div className="gender-options">
                        <label className="gender-option">
                            <input type="radio" name="gender" value="man" disabled={loading} required />
                            <span>Man</span>
                        </label>
                        <label className="gender-option">
                            <input type="radio" name="gender" value="woman" disabled={loading} required />
                            <span>Woman</span>
                        </label>
                    </div>
                </div>
                <div className="input-box">
                    <input
                        type="tel"
                        placeholder="Phone number"
                        disabled={loading}
                        required />
                    <BsFillTelephoneFill className="icon" />
                </div>
            
        
                 <div className="input-box">
                    <Select
                        options={provinces}
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        placeholder="Province"
                        isDisabled={loading}
                        classNamePrefix="select"
                    />
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

    );
}

export default RegisterForm;
