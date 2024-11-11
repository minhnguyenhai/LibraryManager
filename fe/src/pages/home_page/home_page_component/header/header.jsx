import React from "react";
import logo from "../../../../assets/img/logo.jpg";
import './header.css';
import { Link } from "react-router-dom";

const Header = ({ selectedNav, setSelectedNav }) => {
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
                <Link 
                    to="/manage" 
                    className={`nav-link ${selectedNav === "Manage" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Manage")}
                >
                    QUẢN LÝ
                </Link>
                <Link 
                    to="/user" 
                    className={`nav-link ${selectedNav === "User" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("User")}
                >
                    NGƯỜI DÙNG
                </Link>
                <Link 
                    to="/search" 
                    className={`nav-link ${selectedNav === "Search" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Search")}
                >
                    TÌM KIẾM
                </Link>
                <Link 
                    to="/news" 
                    className={`nav-link ${selectedNav === "News" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("News")}
                >
                    TIN TỨC
                </Link>
                <Link 
                    to="/contact" 
                    className={`nav-link ${selectedNav === "Contact" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Contact")}
                >
                    LIÊN HỆ
                </Link>
                <Link to="/login" className="nav-link">ĐĂNG NHẬP</Link>
            </div>
        </div>
    );
}

export default Header;
