import React, { useState } from "react";
import { FaBook } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { HistoryBorrow } from "./user_component/history_borrow/history_borrow";
const User = () => {
    const options = [
        { label: 'Sách yêu thích', icon: <FaBook />, key: 'favourite books' },
        { label: 'Lịch sử mượn sách', icon: <MdWorkHistory />, key: 'history borrow' },
    ];

    const [activeContent, setActiveContent] = useState("favourite books")

    const renderContent = () => {
        switch (activeContent) {
            case 'favourite books':
            case 'history borrow':
                return <HistoryBorrow/>
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