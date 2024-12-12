import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import '../login_register.css';
import { BsFillTelephoneFill } from "react-icons/bs";
import Select from 'react-select';
const RegisterForm = ({ email, password, name, dob, gender, phone_number,
    setEmail, setPassword, setName, setDob, setGender, setPhonenumber, setAddress,
    handleRegister, error, agreeToTerms, setAgreeToTerms, loginLink,loading }) => {
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
                })));
            })
            .catch(error => console.error('Error fetching provinces:', error));

    }, []);

    useEffect(() => {
        if (selectedProvince) {
            setAddress(selectedProvince.label); // Gán địa chỉ bằng tên của tỉnh
        }
    }, [selectedProvince, setAddress]);

    return (
        <div className="form-box register">
            <form onSubmit={handleRegister}>
                <h1>Đăng ký</h1>
                {error && (
                    <div className="error-message text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}
                <div className="input-container">
                    {/* Cột 1 */}
                    <div className="input-column">
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required />
                            <FaUser className="icon" />
                        </div>
                        <div className="input-box">
                            <input
                                type="date"
                                placeholder="Ngày sinh"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required />
                        </div>
                        <div className="gender-box">
                            <span>Giới tính</span>
                            <div className="gender-options">
                                <label className="gender-option">
                                    <input type="radio" name="gender" value="Male" checked={gender === 'Male'}
                                        onChange={(e) => setGender(e.target.value)} required />
                                    <span>Nam</span>
                                </label>
                                <label className="gender-option">
                                    <input type="radio" name="gender" value="Female" checked={gender === 'Female'}
                                        onChange={(e) => setGender(e.target.value)} required />
                                    <span>Nữ</span>
                                </label>
                            </div>
                        </div>
                    </div>
                     {/* Cột 2 */}
                    <div className="input-column">
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
                                type="tel"
                                placeholder="Số điện thoại"
                                value={phone_number}
                                onChange={(e) => setPhonenumber(e.target.value)}
                                required />
                            <BsFillTelephoneFill className="icon" />
                        </div>
                    </div>
                    {/* Cột 3 */}
                    <div className="input-column">
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                            <FaLock className="icon" />
                        </div>
                        <div className="input-box">
                            <Select
                                options={provinces}
                                value={selectedProvince}
                                onChange={setSelectedProvince}
                                placeholder="Địa chỉ"
                                classNamePrefix="select"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Đăng ký"}

                </button>
                <div className="register-link">
                    <p>
                        Bạn đã có tài khoản? <a href="#" onClick={loginLink}>Login</a>
                    </p>
                </div>
            </form>
        </div>

    );
}

export default RegisterForm;
