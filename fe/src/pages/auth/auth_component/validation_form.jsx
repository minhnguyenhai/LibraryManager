// import React from 'react';
// import '../login_register.css';
// const ValidationForm = ({ code, setCode, loading, handleVerifyEmail, error, handleResend }) => (
//     <div className="form-box validation">
//         <form onSubmit={handleVerifyEmail}>
//             <h1>Xác thực</h1>
//             {error && <div className="error-message text-red-500">{error}</div>}
//             <div className="input-box">
//                 <input
//                     type="text"
//                     placeholder="Nhập mã xác thực"
//                     value={code}
//                     onChange={(e) => setCode(e.target.value)}
//                     required />
//             </div>

//             <button type="submit" disabled={loading} >
//                 {loading ? "Loading..." : "Xác nhận"}
//             </button>
//             <div className="register-link">
//                 <p>
//                     Chưa nhận được code? <a href="#" onClick={(e) => {
//                         e.preventDefault();
//                         handleResend();
//                     }}>Gửi lại</a>
//                 </p>
//             </div>
//         </form>
//     </div>

// );

// export default ValidationForm;

import React, { useState, useEffect } from 'react';
import '../login_register.css';

const ValidationForm = ({ code, setCode, loading, handleVerifyEmail, error, handleResend }) => {
    const [showMessage, setShowMessage] = useState(true);

    // Tự động ẩn thông báo sau 5 giây
    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 3000); // 5 giây
            return () => clearTimeout(timer); // Dọn dẹp timer
        }
    }, [showMessage]);

    // Gửi lại code
    const handleResendWithMessage = () => {
        setShowMessage(true); // Hiện thông báo mỗi khi người dùng nhấn "Gửi lại"
        handleResend(); // Gọi hàm xử lý gửi lại code
    };

    return (
        <div className="form-box validation">
            {/* Thông báo đầu form */}
            {showMessage && (
                <div className="info-message">
                    Vui lòng nhập mã xác thực từ email.
                </div>
            )}
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

                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Xác nhận"}
                </button>
                <div className="register-link">
                    <p>
                        Chưa nhận được code? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            handleResendWithMessage();
                        }}>Gửi lại</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ValidationForm;
