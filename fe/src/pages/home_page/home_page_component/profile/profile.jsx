import React, { useState, useEffect } from 'react';
import './profile.css';
import { handleRefreshToken } from '../../../auth/login_register';
import { updateAccount } from '../../../../services/common_servieces';
import { toast, ToastContainer } from 'react-toastify';

const Profile = () => {
    const [user, setUser] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [editedUser, setEditedUser] = useState({});

    const fetchAccount = ()=>{
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }
    useEffect(() => {
        fetchAccount();
    }, []);

    const handleEdit = () => {
        setEditedUser({ ...user });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý lưu thông tin
    const handleSave = async () => {
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const response = await updateAccount(user.id, editedUser, accessToken);
            if(response){
                localStorage.setItem('user_info', JSON.stringify(editedUser));
                toast.success("Cập nhật thông tin tài khoản thành công")
                setTimeout(()=>{
                    setIsEditing(false);
                    fetchAccount();
                },3000)
            }
        } catch (error) {
            toast.error("Cập nhật thông tin thất bại. Vui lòng thử lại")
        }
    };

    // Hủy chỉnh sửa
    const handleCancel = () => {
        setIsEditing(false);
    };

    if (!user) {
        return <div>Đang tải thông tin...</div>;
    }

    return (
        <div className="user-profile-container">
            <ToastContainer/>
            <div className="user-profile-header">
                <h2 className="user-profile-title">Hồ Sơ Cá Nhân</h2>
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="edit-button"
                    >
                        Chỉnh Sửa
                    </button>
                ) : (
                    <div className="action-buttons">
                        <button
                            onClick={handleSave}
                            className="save-button"
                        >
                            Lưu
                        </button>
                        <button
                            onClick={handleCancel}
                            className="cancel-button"
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {/* Tên */}
                <div className="profile-section">
                    <label className="profile-label">Tên</label>
                    {!isEditing ? (
                        <p className="profile-text">{user.name}</p>
                    ) : (
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    )}
                </div>

                {/* Email */}
                <div className="profile-section">
                    <label className="profile-label">Email</label>
                    <p className="profile-text">{user.email}</p>
                </div>

                {/* Số điện thoại */}
                <div className="profile-section">
                    <label className="profile-label">Số Điện Thoại</label>
                    {!isEditing ? (
                        <p className="profile-text">{user.phone_number}</p>
                    ) : (
                        <input
                            type="tel"
                            name="phone_number"
                            value={editedUser.phone_number}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    )}
                </div>

                {/* Địa chỉ */}
                <div className="profile-section">
                    <label className="profile-label">Địa Chỉ</label>
                    {!isEditing ? (
                        <p className="profile-text">{user.address}</p>
                    ) : (
                        <input
                            type="text"
                            name="address"
                            value={editedUser.address}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    )}
                </div>

                {/* Ngày sinh */}
                <div className="profile-section">
                    <label className="profile-label">Ngày Sinh</label>
                    {!isEditing ? (
                        <p className="profile-text">{user.dob}</p>
                    ) : (
                        <input
                            type="date"
                            name="dob"
                            value={editedUser.dob}
                            onChange={handleInputChange}
                            className="profile-input"
                        />
                    )}
                </div>

                {/* Giới tính */}
                <div className="profile-section">
                    <label className="profile-label">Giới Tính</label>
                    {!isEditing ? (
                        <p className="profile-text">
                            {user.gender === 'man' ? 'Nam' :
                                user.gender === 'woman' ? 'Nữ' : 'Khác'}
                        </p>
                    ) : (
                        <select
                            name="gender"
                            value={editedUser.gender}
                            onChange={handleInputChange}
                            className="profile-input"
                        >
                            <option value="man">Nam</option>
                            <option value="woman">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;