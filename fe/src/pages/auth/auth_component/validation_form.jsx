import React from 'react';
import '../login_register.css';
const ValidationForm = ({ code, setCode, loading, handleValidation, error, forgotPasswordLink }) => (
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

);

export default ValidationForm;
