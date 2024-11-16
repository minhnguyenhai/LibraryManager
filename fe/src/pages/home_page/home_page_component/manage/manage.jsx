import React, { useState } from "react";
import { FaBook, FaUserCircle } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import './manage.css';

import ManageBooks from "./manage_component/manage_books/manage_books";
import ManageReaders from "./manage_component/manage_readers";
import ManageBorrowReturn from "./manage_component/manage_borrowreturn";
import StatisticsReports from "./manage_component/statistics_reports";

const Manage = () => {
    const [activeContent, setActiveContent] = useState("books");

    const options = [
        { label: 'Quản lý tài nguyên sách', icon: <FaBook />, key: 'books' },
        { label: 'Quản lý độc giả', icon: <FaUserCircle />, key: 'readers' },
        { label: 'Quản lý trả mượn', icon: <IoLibrary />, key: 'borrowReturn' },
        { label: 'Thống kê & báo cáo', icon: <BiSolidReport />, key: 'statisticsReports' },
    ];

    const renderContent = () => {
        switch (activeContent) {
            case "books":
                return <ManageBooks />;
            case "readers":
                return <ManageReaders />;
            case "borrowReturn":
                return <ManageBorrowReturn />;
            case "statisticsReports":
                return <StatisticsReports />;
            default:
                return <p>Chọn một mục để xem nội dung</p>;
        }
    };

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
};

export default Manage;
