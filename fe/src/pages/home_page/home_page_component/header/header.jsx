import React from "react";
import logo from "../../../../assets/img/logo.jpg";
import './header.css';
import { Link } from "react-router-dom";

const Header = ({ selectedNav, setSelectedNav }) => {
    return (
        <div className="header">
            <div className="header-left">
                <img src={logo} alt="logo" className="header-logo" />
                <a href="/">E-LIBRARY MANAGEMENT SYSTEM</a>
                
            </div>
            <div className="header-nav">
                <Link 
                    to="/home" 
                    className={`nav-link ${selectedNav === "Home" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Home")}
                >
                    HOME
                </Link>
                <Link 
                    to="/manage" 
                    className={`nav-link ${selectedNav === "Manage" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Manage")}
                >
                    Manage
                </Link>
                <Link 
                    to="/user" 
                    className={`nav-link ${selectedNav === "User" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("User")}
                >
                    USER
                </Link>
                <Link 
                    to="/search" 
                    className={`nav-link ${selectedNav === "Search" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Search")}
                >
                    SEARCH
                </Link>
                <Link 
                    to="/news" 
                    className={`nav-link ${selectedNav === "News" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("News")}
                >
                    NEWS
                </Link>
                <Link 
                    to="/contact" 
                    className={`nav-link ${selectedNav === "Contact" ? "active" : ""}`} 
                    onClick={() => setSelectedNav("Contact")}
                >
                    CONTACT
                </Link>
                <Link to="/login" className="nav-link">LOGIN/REGISTER</Link>
            </div>
        </div>
    );
}

export default Header;
