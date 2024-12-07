import React, { useState, useEffect } from "react";
import logo from "../../../../assets/img/logo.jpg";
import defaultAvatar from "../../../../assets/img/default-avatar.png";
import './header.css';
import { Link, useNavigate } from "react-router-dom";
import { handleRefreshToken } from "../../../auth/login_register";
import { logout } from "../../../../services/user_services/auth";

const Header = ({ selectedNav, setSelectedNav }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleRefreshToken();
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user_info');
        if (token && user) {
            setIsLoggedIn(true);
            setUserData(JSON.parse(user));
        }
    }, []);

    const handleLogout = async () => {
        try {
            handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const response = await logout(accessToken);
            console.log('phản hồi', response);
            if (response) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_info');
                localStorage.removeItem('selectedNav');
                setIsLoggedIn(false);
                setUserData(null);
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderAccountSection = () => {
        if (isLoggedIn && userData) {
            return (
                <div className="account-dropdown-container">
                    <div className="nav-link account-trigger">
                        <img
                            src={userData.avatar || defaultAvatar}
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        <span >{userData.name}</span>
                    </div>
                    <div className="account-dropdown">
                        <Link to="/profile" className="dropdown-item">Hồ sơ của tôi</Link>
                        <Link to="/settings" className="dropdown-item">Cài đặt</Link>
                        <div
                            className="dropdown-item logout-item"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link to="/login" className="nav-link">ĐĂNG NHẬP</Link>
        );
    };

    return (
        <div className="header">
            <div className="header-left">
                <img src={logo} alt="logo" className="header-logo" />
                <a href="/">HỆ THỐNG QUẢN LÝ THƯ VIỆN ĐIỆN TỬ</a>
            </div>
            <div className="header-nav">
                <Link
                    to="/home"
                    className={`nav-link ${selectedNav === "Home" ? "active" : ""}`}
                    onClick={() => setSelectedNav("Home")}
                >
                    TRANG CHỦ
                </Link>
            
                {userData?.role === "admin" && (
                    <Link
                        to="/manage"
                        className={`nav-link ${selectedNav === "Manage" ? "active" : ""}`}
                        onClick={() => setSelectedNav("Manage")}
                    >
                        QUẢN LÝ
                    </Link>
                )}

                {/* Chỉ hiển thị mục "Dịch vụ người dùng" nếu vai trò là reader */}
                {userData?.role === "reader" && (
                    <Link
                        to="/user"
                        className={`nav-link ${selectedNav === "User" ? "active" : ""}`}
                        onClick={() => setSelectedNav("User")}
                    >
                        DỊCH VỤ NGƯỜI DÙNG
                    </Link>
                )}
                <Link
                    to="/search"
                    className={`nav-link ${selectedNav === "Search" ? "active" : ""}`}
                    onClick={() => setSelectedNav("Search")}
                >
                    TÌM KIẾM
                </Link>
                <Link
                    to="/contact"
                    className={`nav-link ${selectedNav === "Contact" ? "active" : ""}`}
                    onClick={() => setSelectedNav("Contact")}
                >
                    LIÊN HỆ
                </Link>
                {renderAccountSection()}
            </div>
        </div>
    );
}

export default Header;