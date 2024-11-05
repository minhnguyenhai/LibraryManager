import React from 'react';
import { FaLock } from "react-icons/fa";
import '../login_register.css';
const ResetPasswordForm = ({ password, confirmpassword, setPassword, setConfirmpassword, loading, handleResetPassword, error }) => (
    <div className="form-box resetpassword">
        <form onSubmit={handleResetPassword}>
            <h1>Reset Password</h1>
            {error && <div className="error-message text-red-500">{error}</div>}
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
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    disabled={loading}
                    required />
                <FaLock className="icon" />
            </div>
            <button type="submit" disabled={loading}>Reset Password</button>
        </form>
    </div>
);

export default ResetPasswordForm;
