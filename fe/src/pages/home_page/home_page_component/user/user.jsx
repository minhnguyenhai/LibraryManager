import React, { useState } from "react";
import { FaBook } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import FavouriteBooks from "./favourite_books/favourite_books";
import HistoryBorrow from "./history_borrow/history_borrow";
const User = () => {
    const [activeContent, setActiveContent] = useState("favourite_books");
    

    const options = [
        { label: 'Sách yêu thích', icon: <FaBook />, key: "favourite_books" },
        { label: 'Lịch sử mượn sách', icon: <MdWorkHistory />, key: "history_borrow" },
    ];



    const renderContent = () => {
        switch (activeContent) {
            case "favourite_books":
                return <FavouriteBooks />;
            case "history_borrow":
                return <HistoryBorrow />;
            default:
                return <p>Chọn một mục để xem nội dung</p>;
        }
    }
    return (
        <div className="manage-container">
            <div className="manage-section">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`manage-option ${activeContent === option.key ? 'active' : ''}`}
                        onClick={() => setActiveContent(option.key)}
                    >
                        <div className="manage-option-icon">
                            {option.icon}
                        </div>
                        <span className="label">{option.label}</span>
                    </button>
                ))}
            </div>
            <div className="manage-content">
                {renderContent()}
            </div>
        </div>
    );
}
export default User