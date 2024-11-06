import React from "react";
import logo from "../../../../assets/img/logo.jpg"
import './header.css'
const Header =()=>{
    return(
        <div className="header">
            <div className="header-left">
                <img src={logo} alt="logo" className="header-logo"/>
                <a href="#">E-LIBRARY MANAGEMENT SYSTEM</a>
            </div>
            <div className="header-nav">
                <a href="#" className="nav-link">HOME</a>
                <a href="#" className="nav-link">MANAGE</a>
                <a href="#" className="nav-link">USER</a>
                <a href="#" className="nav-link">SEARCH</a>
                <a href="#" className="nav-link">NEWS</a>
                <a href="#" className="nav-link">CONTACT</a>
                <a href="#" className="nav-link">LOGIN/REGISTER</a>
            </div>
        </div>
    );
}
export default Header