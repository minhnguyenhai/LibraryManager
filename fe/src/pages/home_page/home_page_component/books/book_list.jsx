import React, { useState } from 'react';
import './book_list.css';

const BookList = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  // Giả lập một danh sách sách lớn hơn
  const allBooks = Array(25).fill().map((_, index) => ({
    id: index + 1,
    title: `Book ${index + 1}`,
    author: `Author ${index + 1}`,
    price: `$${(Math.random() * 20 + 10).toFixed(2)}`,
    imageUrl: "https://kenh14cdn.com/thumb_w/600/27fc8f4935/2015/09/09/TTHVTCX%20-%20Official%20poster-cd46e.jpg",
    description: `This is a detailed description for Book ${index + 1}. It contains all the important information about the book that readers might want to know before making a purchase decision...`
  }));

  // Tính toán số trang
  const totalPages = Math.ceil(allBooks.length / booksPerPage);

  // Lấy sách cho trang hiện tại
  const getCurrentBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    return allBooks.slice(startIndex, endIndex);
  };

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Số nút trang tối đa hiển thị

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn maxPagesToShow, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pageNumbers.push(1);

      // Tính toán range của các trang giữa
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Thêm dấu ... nếu cần
      if (start > 2) {
        pageNumbers.push('...');
      }

      // Thêm các trang giữa
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Thêm dấu ... và trang cuối
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleCardClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setSelectedBook(null);
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="book-container">
      <h1 className="book-title">Danh sách sách</h1>

      <div className="book-grid">
        {getCurrentBooks().map((book) => (
          <div key={book.id} className="book-card" onClick={() => handleCardClick(book)}>
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
                    // Add to cart logic here
                  }}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </button>

        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => typeof number === 'number' ? handlePageChange(number) : null}
            disabled={typeof number !== 'number'}
          >
            {number}
          </button>
        ))}

        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>

        <span className="pagination-info">
          Trang {currentPage} / {totalPages}
        </span>
      </div>

      {/* Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={handleModalClick}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <img
              src={selectedBook.imageUrl}
              alt={selectedBook.title}
              className="modal-image"
            />
            <h2 className="modal-title">{selectedBook.title}</h2>
            <p className="modal-author">{selectedBook.author}</p>
            <p className="modal-description">{selectedBook.description}</p>
            <div className="modal-footer">
              <span className="book-price">{selectedBook.price}</span>
              <button className="add-to-cart-button">Thêm vào giỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;