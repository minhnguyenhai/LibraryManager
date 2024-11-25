import React, { useEffect, useState } from 'react';
import SearchBar from '../../../search/search_bar';
import '../../manage.css'
import './manage_books.css'
import Pagination from '../../../pagination/pagination';
import BookModal from '../../../books/book_modal';
import EditBookModal from '../../../edit_book_modal/edit_book_modal';
import AddBookModal from '../../../add_book_modal/add_book_modal';
import ConfirmationDialog from '../../../confirmation_dialog/confirmation_dialog';
import { getAllBooks } from '../../../../../../services/user_services/main_services';
import { deleteBook } from '../../../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../../../auth/login_register';



// const generateBooks = (count) => {
//     return Array.from({ length: count }, (_, index) => ({
//         id: index + 1,
//         title: `Book ${index + 1}`,
//         author: `Author ${Math.floor(index / 5) + 1}`,
//         price: `$${(15 + Math.random() * 25).toFixed(2)}`,
//         imageUrl: "https://kenh14cdn.com/thumb_w/600/27fc8f4935/2015/09/09/TTHVTCX%20-%20Official%20poster-cd46e.jpg",
//         description: `This is a detailed description for Book ${index + 1}. It contains all the important information about the book that readers might want to know before making a purchase decision...`,
//         quantity: Math.floor(Math.random() * 10) + 1
//     }));
// };

const allBooks = Array(100).fill().map((_, index) => ({
    id: index + 1,
    title: `Book ${index + 1}`,
    author: `Author ${index + 1}`,
    price: `$${(Math.random() * 20 + 10).toFixed(2)}`,
    imageUrl: "https://kenh14cdn.com/thumb_w/600/27fc8f4935/2015/09/09/TTHVTCX%20-%20Official%20poster-cd46e.jpg",
    description: `This is a detailed description for Book ${index + 1}. It contains all the important information about the book that readers might want to know before making a purchase decision...`,
    quantity: Math.floor(Math.random() * 10) + 1
}));

const ManageBooks = () => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        bookToDelete: null
    });

    const [books, setBooks] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    // const allBooks = generateBooks(100);

    const fetchBooks = async () => {
        try {
            const data = await getAllBooks();
            setBooks(data || []);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    useEffect(() => {
        fetchBooks();
    })

    //lọc sách
    const [filteredBooks, setFilteredBooks] = useState(allBooks);

    const handleSearch = (searchResults) => {
        setFilteredBooks(searchResults);
        setCurrentPage(1); // Reset to first page after search
    };

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    
    const getCurrentBooks = () => {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        return filteredBooks.slice(startIndex, endIndex);
    };

    const handleReadClick = (book) => {
        setSelectedBook(book);
    };

    const handleEditClick = (book) => {
        setEditingBook(book);
    };

    const handleSaveEditedBook = (updatedBook) => {
        // Thay đổi dữ liệu sách trong danh sách (giả lập cập nhật)
        const bookIndex = books.findIndex((b) => b.id === updatedBook.id);
        if (bookIndex !== -1) {
            books[bookIndex] = updatedBook;
        }
        setEditingBook(null); // Đóng modal
    };

    const handleAddNewBook = (newBook) => {
        allBooks.push(newBook); // Thêm sách mới vào danh sách
        setIsAddingBook(false); // Đóng modal
    };

    const handleDeleteClick = (book) => {
        setDeleteConfirmation({
            isOpen: true,
            bookToDelete: book
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmation.bookToDelete) {
            try {
                handleRefreshToken();
                const accessToken = localStorage.getItem('access_token');
                const response = await deleteBook(deleteConfirmation.bookToDelete.id, accessToken);
                if (response.status === 204) {
                    // Update local state to remove the deleted book
                    const updatedBooks = books.filter(
                        book => book.id !== deleteConfirmation.bookToDelete.id
                    );
                    // If you're managing books state, update it
                    setBooks(updatedBooks);
                } else {
                    console.log(response.status)
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
        setDeleteConfirmation({
            isOpen: false,
            bookToDelete: null
        });
    };

    return (
        <div className="manage-books-content">
            <div className="searchbar-option">
                <SearchBar
                    onSearch={handleSearch}
                    data={allBooks}
                    searchFields={['title','author']}
                />
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
                                            onClick={() => handleDeleteClick(book)}
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
                    addToCart: 'Thêm vào danh sách yêu thích'
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

export default ManageBooks;
