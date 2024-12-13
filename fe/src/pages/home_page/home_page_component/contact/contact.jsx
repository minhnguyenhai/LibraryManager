import React, { useEffect, useState } from "react";
import './contact.css'
const Contact = () => {
    return (
        <div className="contact-section">
            <h2 className="section-title">Liên hệ</h2>
            <div className="contact-details">
                <div className="detail">
                    <h3>Trung tâm Truyền thông và Tri thức số - Đại học Bách Khoa Hà Nội</h3>
                    <p>Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
                </div>
                <div className="detail">
                    <h3>Điện thoại</h3>
                    <p>(+84) 345 657 8888</p>
                </div>
                <div className="detail">
                    <h3>Website</h3>
                    <a href="http://library.hust.edu.vn/">http://library.hust.edu.vn/</a>
                </div>
                <div className="detail">
                    <h3>Email</h3>
                    <p>group34webhustsupport@gmail.com</p>
                </div>
            </div>
            <div className="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7651815716956!2d105.84179251480914!3d21.00457508601493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4d28d33675%3A0x7a49a79dd66ae75c!2s%C4%90%E1%BA%A1i%20h%E1%BB%8Dc%20B%C3%A1ch%20Khoa%20H%C3%A0%20N%E1%BB%99i!5e0!3m2!1svi!2s!4v1683002384741!5m2!1svi!2s"
                    className="map-embed"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

            </div>
            <h3>Trang web được phát triển bởi các thành viên</h3>
            <div className="meber-develop">
                <div className="members">
                    <div className="member-detail">
                        <img src="https://thuvienanime.com/wp-content/uploads/2023/10/truong-tieu-pham-quy-le-thuvienanime-thumb.jpg" alt="" />
                        <div className="meber-detail-text">
                            <p>Nguyễn Hải Minh</p>
                            <p>Email:ngyenminh@gmail.com</p>
                        </div>
                    </div>
                    <div className="member-detail">
                        <img src="https://thuvienanime.com/wp-content/uploads/2023/10/truong-tieu-pham-quy-le-thuvienanime-thumb.jpg" alt="" />
                        <div className="meber-detail-text">
                            <p>Nguyễn Nhật Minh</p>
                            <p>Email:ngyenminh@gmail.com</p>
                        </div>
                    </div>
                </div>
                <div className="members">
                    <div className="member-detail">
                        <img src="https://thuvienanime.com/wp-content/uploads/2023/10/truong-tieu-pham-quy-le-thuvienanime-thumb.jpg" alt="" />
                        <div className="meber-detail-text">
                            <p>Trần Văn Minh</p>
                            <p>Email:ngyenminh@gmail.com</p>
                        </div>
                    </div>
                    <div className="member-detail">
                        <img src="https://thuvienanime.com/wp-content/uploads/2023/10/truong-tieu-pham-quy-le-thuvienanime-thumb.jpg" alt="" />
                        <div className="meber-detail-text">
                            <p>Nguyễn Minh</p>
                            <p>Email:ngyenminh@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default Contact