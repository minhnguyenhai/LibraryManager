import React from "react";
import { FaBook, FaUserCircle } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import './manage.css'
const Manage = () => {
    const options = [
        { label: 'Quản lý tài nguyên sách', icon: <FaBook />, link: '/manage/books' },
        { label: 'Quản lý độc giả', icon: <FaUserCircle />, link: '/manage/readers' },
        { label: 'Quản lý trả mượn', icon: <IoLibrary />, link: '/manage/borrow-return' },
        { label: 'Thống kê & báo cáo', icon: <BiSolidReport />, link: '/manage/statistics-reports' },
    ];

    // Render the component
    return (
        <div className="manage-section">
            {options.map((option, index) => (
                <a href={option.link} className="manage-option" key={index}>
                    <div className="manage-option-icon">
                         {option.icon} 
                    </div>
                    <span className="label">{option.label}</span>
                </a>
            ))}
        </div>
    );
}
export default Manage