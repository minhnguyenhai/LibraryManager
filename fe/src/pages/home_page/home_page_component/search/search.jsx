import React from "react";
import "./search.css"
import { FaSearch } from "react-icons/fa";
import BookList from "../books/book_list";
import SearchBar from "./search_bar";
const Search = () => {
    return (
        <div className="search_wrapper">
            <div className="search-container">
                <div className="search-input-wrapper">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm..." className="search-input" />
                    <button className="search-button">Tìm kiếm</button>
                </div>
                <button className="catalog-button">Mục lục thư viện</button>
            </div>
            <BookList />
        </div>
    );
}
export default Search