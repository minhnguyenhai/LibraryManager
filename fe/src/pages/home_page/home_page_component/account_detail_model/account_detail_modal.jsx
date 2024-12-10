import React from 'react';
const AccountDetailModal = ({ selectedUser, onClose }) => {
    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="borrow-history-modal-overlay" onClick={handleOverlayClick}>
            <div className="borrow-history-modal-content" onClick={handleContentClick}>
                <div className="borrow-history-modal-header">
                    <h2>Thông tin chi tiết người dùng</h2>
                    <button
                        className="close-modal-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="borrow-history-modal-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Ngày tạo tài khoản</th>
                                <th>Ngày cập nhật</th>
                                <th>Vai trò</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={selectedUser.id}>
                                <td>{selectedUser.name}</td>
                                <td>{selectedUser.email}</td>
                                <td>{selectedUser.phone_number}</td>
                                <td>{selectedUser.address}</td>
                                <td>{selectedUser.dob}</td>
                                <td>{selectedUser.gender}</td>
                                <td>{selectedUser.created_at}</td>
                                <td>{selectedUser.updated_at}</td>
                                <td>{selectedUser.role}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailModal;