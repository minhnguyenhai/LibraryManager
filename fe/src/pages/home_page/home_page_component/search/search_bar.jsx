import React from "react";
import "./search.css"
import { FaSearch } from "react-icons/fa";
const SearchBar = () => {
    return (
        <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Tìm kiếm..." className="search-input" />
            <button className="search-button">Tìm kiếm</button>
        </div>
    );
}
export default SearchBar