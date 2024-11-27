import React, { useRef } from "react";
import './home.css'
import { useNavigate } from "react-router-dom";
const Home = ({setSelectedNav}) => {
    const servicesRef = useRef(null);
    
    const scrollToServices = () => {
        servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const navigate= useNavigate();
    const handleSearchNavigation = () => {
        navigate('/search');
        setSelectedNav("Search");
    };

    const handleContactNavigation=()=>{
        navigate('/contact');
        setSelectedNav("Contact");
    }

    return (
        <div className="library-homepage">
            <div className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Thư Viện Điện Tử</h1>
                    <p>Khám phá tri thức không giới hạn</p>
                    <div className="hero-buttons">
                        <button onClick={scrollToServices} className="btn-explore">Khám Phá Ngay</button>
                        <a href="/login">< button className="btn-register">Đăng Ký</button> </a>
                    </div>
                </div>
            </div>

            <div ref={servicesRef} className="services-container">
                <div className="service-card book-service">
                    <div className="card-content">
                        <h2>Kho Sách Điện Tử</h2>
                        <p>Bộ sưu tập phong phú với hàng ngàn đầu sách</p>
                        <a href=""onClick={handleSearchNavigation} className="service-link">Xem Chi Tiết</a>
                    </div>
                </div>
                <div className="service-card search-service">
                    <div className="card-content">
                        <h2>Tìm Kiếm Thông Minh</h2>
                        <p>Công cụ tìm kiếm nhanh và chính xác</p>
                        <a href=""onClick={handleSearchNavigation} className="service-link">Tìm Kiếm Ngay</a>
                    </div>
                </div>
                <div className="service-card community-service">
                    <div className="card-content">
                        <h2>Giải đáp nhanh chóng</h2>
                        <p>Kết nối với nhưng người quản lý sách</p>
                        <a href=""onClick={handleContactNavigation} className="service-link">Liên hệ ngay</a>
                    </div>
                </div>
            </div>

            <div className="library-stats">
                <div className="stats-background">
                    <div className="stat-grid">
                        <div className="stat-item">
                            <span className="stat-number">10,000+</span>
                            <span className="stat-label">Sách Điện Tử</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Truy Cập</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5,000+</span>
                            <span className="stat-label">Thành Viên</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home