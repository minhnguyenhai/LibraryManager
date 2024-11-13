import React from 'react';
import '../login_register.css';
const ValidationForm = ({ code, setCode, loading, handleVerifyEmail, error, handleResend }) => (
    <div className="form-box validation">
        <form onSubmit={handleVerifyEmail}>
            <h1>Xác thực</h1>
            {error && <div className="error-message text-red-500">{error}</div>}
            <div className="input-box">
                <input
                    type="text"
                    placeholder="Nhập mã xác thực"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required />
            </div>

            <button type="submit">Xác nhận</button>
            <div className="register-link">
                <p>
                    Chưa nhận được code? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleResend();
                    }}>Gửi lại</a>
                </p>
            </div>
        </form>
    </div>

);

export default ValidationForm;
