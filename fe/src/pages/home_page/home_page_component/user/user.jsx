import React from "react";
import { FaBook } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
const User=()=>{
    const options = [
        { label: 'Tìm đọc sách', icon: <FaBook />, link: '/manage/books' },
        { label: 'Lịch sử mượn sách', icon: <MdWorkHistory />, link: '/manage/readers' },
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
export default User