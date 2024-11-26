import React, { useState } from 'react';
import './favourite_books.css';
import SearchBar from '../../search/search_bar';
import Pagination from '../../pagination/pagination';
import BookModal from '../../books/book_modal';
import ConfirmationDialog from '../../confirmation_dialog/confirmation_dialog';
import AddBookModal from '../../add_book_modal/add_book_modal';
import EditBookModal from '../../edit_book_modal/edit_book_modal';

const generateBooks = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: `Book ${index + 1}`,
        author: `Author ${Math.floor(index / 5) + 1}`,
        price: `$${(15 + Math.random() * 25).toFixed(2)}`,
        imageUrl: "https://kenh14cdn.com/thumb_w/600/27fc8f4935/2015/09/09/TTHVTCX%20-%20Official%20poster-cd46e.jpg",
        description: `This is a detailed description for Book ${index + 1}. It contains all the important information about the book that readers might want to know before making a purchase decision...`,
        quantity: Math.floor(Math.random() * 10) + 1
    }));
};
function FavouriteBooks() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        bookToDelete: null
    });

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const allBooks = generateBooks(100);
    const totalPages = Math.ceil(allBooks.length / booksPerPage);

    const getCurrentBooks = () => {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        return allBooks.slice(startIndex, endIndex);
    };

    const handleReadClick = (book) => {
        setSelectedBook(book);
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
    };

    const handleSaveEditedBook = (updatedBook) => {
        // Thay đổi dữ liệu sách trong danh sách (giả lập cập nhật)
        const bookIndex = allBooks.findIndex((b) => b.id === updatedBook.id);
        if (bookIndex !== -1) {
            allBooks[bookIndex] = updatedBook;
        }
        setEditingBook(null); // Đóng modal
    };

    const handleAddNewBook = (newBook) => {
        newBook.id = allBooks.length + 1; // Tạo ID mới
        allBooks.push(newBook); // Thêm sách mới vào danh sách
        setIsAddingBook(false); // Đóng modal
    };

    const handleDeleteClick = (book) => {
        setDeleteConfirmation({
            isOpen: true,
            bookToDelete: book
        });
    };

    const handleConfirmDelete = () => {
        if (deleteConfirmation.bookToDelete) {
            // Xử lý logic xóa sách ở đây
            const updatedBooks = allBooks.filter(
                book => book.id !== deleteConfirmation.bookToDelete.id
            );
            // Cập nhật lại danh sách sách
            // Trong trường hợp thực tế, bạn sẽ gọi API để xóa
        }
        // Đóng modal
        setDeleteConfirmation({
            isOpen: false,
            bookToDelete: null
        });
    };

    return (
        <div className="manage-books-content">
            <div className="searchbar-option">
                <SearchBar />
                <button className="catalog-button" onClick={() => setIsAddingBook(true)}>Thêm sách</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Mô tả</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>

                        {getCurrentBooks().map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td className="image-column">
                                    <img src={book.imageUrl} alt={book.title} />
                                    {book.title}
                                </td>
                                <td>{book.author}</td>
                                <td className='description-column' >{book.description}</td>
                                <td>{book.price}</td>
                                <td>{book.quantity}</td>
                                <td>
                                    <div className="button-option">
                                        <button
                                            onClick={() => handleReadClick(book)}
                                        >
                                            Xem thông tin
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(book)}
                                        >
                                            Sửa thông tin
                                        </button>
                                        <button
                                            onClick={()=>handleDeleteClick(book)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                maxPagesToShow={5}
                labels={{
                    previous: 'Trước',
                    next: 'Sau',
                    pageInfo: 'Trang {current} / {total}'
                }}
            />

            {/* Modal */}
            <BookModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
                labels={{
                    addToCart: 'Thêm vào giỏ'
                }}
            />

            <EditBookModal
                book={editingBook}
                onClose={() => setEditingBook(null)}
                onSave={handleSaveEditedBook}
            />

            {isAddingBook && (
                <AddBookModal
                    onClose={() => setIsAddingBook(false)}
                    onAdd={handleAddNewBook}
                />
            )}

            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, bookToDelete: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa sách "${deleteConfirmation.bookToDelete?.title}" không?`}
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
        </div>
    );
};

export default FavouriteBooks;