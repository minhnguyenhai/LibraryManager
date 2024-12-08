import React, { useState } from "react";
import "./search.css";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch,loading }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            onSearch(searchTerm); // Gọi callback khi nhấn Enter
        }
    };

    return (
        <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Tìm kiếm..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <button
                className="search-button"
                onClick={() => onSearch(searchTerm)} // Gọi callback khi nhấn nút
                disabled={loading}
            >
                {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
        </div>
    );
};

export default SearchBar;
