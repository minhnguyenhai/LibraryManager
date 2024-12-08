import React, { useEffect, useState } from "react";
import "./book_list.css";
import Pagination from "../pagination/pagination";
import BookModal from "./book_modal";
import { handleRefreshToken } from "../../../auth/login_register";
import { getAllBooks } from "../../../../services/common_servieces";

const BookList = ({
  books,
  setBooks,
  filteredBooks,
  setFilteredBooks,
}) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const booksPerPage = 10;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      await handleRefreshToken();
      const accessToken = localStorage.getItem("access_token");
      const data = await getAllBooks(accessToken);
      setBooks(data || []); // Lưu toàn bộ danh sách
      setFilteredBooks(data || []); // Lưu danh sách đã lọc ban đầu
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Tính toán số trang
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Lấy sách cho trang hiện tại
  const getCurrentBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  };

  const handleCardClick = (book) => {
    setSelectedBook(book);
  };

  return (
    <div className="book-container">
      <h1 className="book-title">Danh sách sách</h1>
      {loading && <p>Đang tải dữ liệu...</p>}

      <div className="book-grid">
        {getCurrentBooks().map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => handleCardClick(book)}
          >
            <div className="book-card-header">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="book-image"
              />
            </div>
            <div className="book-card-content">
              <h2 className="book-name">{book.title}</h2>
              <p className="book-author">{book.author}</p>
              <p className="book-description">{book.description}</p>
              <div className="book-card-footer">
                <span className="book-price">{book.price}</span>
                <button
                  className="add-to-cart-button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Thêm vào danh sách yêu thích
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxPagesToShow={5}
        labels={{
          previous: "Trước",
          next: "Sau",
          pageInfo: "Trang {current} / {total}",
        }}
      />

      {/* Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        labels={{
          addToCart: "Thêm vào danh sách yêu thích",
        }}
      />
    </div>
  );
};

export default BookList;
