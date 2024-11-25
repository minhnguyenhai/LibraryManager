// import React from "react";
// import "./search.css"
// import { FaSearch } from "react-icons/fa";
// const SearchBar = () => {
//     return (
//         <div className="search-input-wrapper">
//             <FaSearch className="search-icon" />
//             <input type="text" placeholder="Tìm kiếm..." className="search-input" />
//             <button className="search-button">Tìm kiếm</button>
//         </div>
//     );
// }
// export default SearchBar
import React, { useState } from "react";
import "./search.css"
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
    onSearch,
    data,
    searchFields = ['title']
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        // Kiểm tra nếu không có dữ liệu hoặc phương thức tìm kiếm
        if (!data || !onSearch) return;

        // Lọc dữ liệu dựa trên các trường được chỉ định
        const filteredResults = data.filter(item =>
            searchFields.some(field =>
                item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        // Gọi hàm callback được truyền vào từ componentcha
        onSearch(filteredResults);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
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
                onClick={() => handleSearch()}
            >
                Tìm kiếm
            </button>
        </div>
    );
}

export default SearchBar;