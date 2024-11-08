import React from "react";
import "./search.css"
import { FaSearch } from "react-icons/fa";
const Search = () => {
    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search..." className="search-input" />
                <button className="search-button">Search</button>
            </div>
            <button className="catalog-button">Library Catalog</button>
        </div>
    );
}
export default Search