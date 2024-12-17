import React, { useEffect, useState } from 'react';
import { handleRefreshToken } from '../../../auth/login_register';
import { toast } from 'react-toastify';
import { updateAccount } from '../../../../services/common_servieces';

const EditAccountModal = ({ account, onClose, onSave, triggerRefresh }) => {
    const [editedAccount, setEditedAccount] = useState({ ...account });
    useEffect(() => {
        setEditedAccount({ ...account });
    }, [account]);

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };
    const handleContentClick = (e) => {
        e.stopPropagation();
    };
    const handleChange = (field, value) => {
        setEditedAccount({
            ...editedAccount,
            [field]: value
        });
    };

    const handleSave = async () => {
        try {
            console.log('Account', account)
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const response = await updateAccount(editedAccount.id, editedAccount, accessToken);
            if (response) {
                onSave();
                onClose();
                toast.success("Sửa thông tin thành công");
                setTimeout(() => {
                    triggerRefresh();
                }, 2000);
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi cập nhật. Vui lòng thử lại');
        }
    };

    if (!account) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Chỉnh sửa thông tin tài khoản</h2>
                <form className="edit-Account-form">
                    <div className="form-group">
                        <label htmlFor="name">Tên người dùng</label>
                        <input
                            id="name"
                            type="text"
                            value={editedAccount.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Ngày sinh</label>
                        <input
                            id="dob"
                            type="date"
                            value={editedAccount.dob}
                            onChange={(e) => handleChange('dob', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Giới tính</label>
                        <input
                            id="gender"
                            type="text"
                            value={editedAccount.gender}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            id="address"
                            type="text"
                            value={editedAccount.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Số Điện thoại</label>
                        <textarea
                            id="phone_number"
                            value={editedAccount.phone_number}
                            onChange={(e) => handleChange('phone_number', e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleSave}>
                            Lưu
                        </button>
                        <button type="button" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default EditAccountModal;
