import React, { useState, useEffect } from "react";
import './home_page.css';
import Header from "./home_page_component/header/header";
import Footer from "./home_page_component/footer/Footer";
import { Outlet, useLocation } from "react-router-dom";
import Home from "./home_page_component/home/home";

const HomePage = () => {
    // Lấy giá trị selectedNav từ localStorage khi trang được tải lại
    const [selectedNav, setSelectedNav] = useState(localStorage.getItem('selectedNav') || '');

    const location = useLocation();

    useEffect(() => {
        // Cập nhật selectedNav vào localStorage mỗi khi nó thay đổi
        if (selectedNav) {
            localStorage.setItem('selectedNav', selectedNav);
        }
        if(location.pathname==='/'){
            setSelectedNav('');
        }
    }, [selectedNav]);

    return (
        <div className="home-page">
            <Header selectedNav={selectedNav} setSelectedNav={setSelectedNav} />
            <div className="body-content">
                {location.pathname === '/' ? <Home setSelectedNav={setSelectedNav}/> : <Outlet />}
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
