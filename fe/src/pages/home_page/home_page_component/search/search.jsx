import React from "react";
import "./search.css"
import BookList from "../books/book_list";
import SearchBar from "./search_bar";
const Search = () => {
    return (
        <div className="search_wrapper">
            <div className="search-container">
                
                <SearchBar

                />
                <button className="catalog-button">Mục lục thư viện</button>
            </div>
            <BookList />
        </div>
    );
}
export default Search