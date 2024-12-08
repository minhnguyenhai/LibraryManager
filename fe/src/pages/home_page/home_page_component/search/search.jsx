import React, { useState } from "react";
import "./search.css";
import BookList from "../books/book_list";
import SearchBar from "./search_bar";
import { search } from "../../../../services/common_servieces";
import { handleRefreshToken } from "../../../auth/login_register";

const Search = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchTerm) => {
        if (!searchTerm.trim()) return; // Bỏ qua nếu từ khóa rỗng

        setLoading(true);
        try {
            handleRefreshToken();
            const accessToken = localStorage.getItem("access_token"); // Lấy JWT Token từ localStorage
            const results = await search(searchTerm, accessToken); // Gọi API tìm kiếm
            setFilteredBooks(results); // Cập nhật kết quả tìm kiếm
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search_wrapper">
            <div className="search-container">
                <SearchBar onSearch={handleSearch} loading={loading} />
                <button className="catalog-button">Mục lục thư viện</button>
            </div>
            {/* Truyền dữ liệu đã lọc xuống BookList */}
            <BookList
                books={books}
                setBooks={setBooks}
                filteredBooks={filteredBooks}
                setFilteredBooks={setFilteredBooks}
            />
        </div>
    );
};

export default Search;
