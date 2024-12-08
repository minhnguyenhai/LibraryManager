import React, { useEffect, useState } from 'react';
import SearchBar from '../../../search/search_bar';
import '../../manage.css'
import './manage_books.css'
import Pagination from '../../../pagination/pagination';
import BookModal from '../../../books/book_modal';
import EditBookModal from '../../../edit_book_modal/edit_book_modal';
import AddBookModal from '../../../add_book_modal/add_book_modal';
import ConfirmationDialog from '../../../confirmation_dialog/confirmation_dialog';
import { deleteBook } from '../../../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../../../auth/login_register';
import { getAllBooks, search } from '../../../../../../services/common_servieces';
import { toast, ToastContainer } from 'react-toastify'; // Nếu bạn sử dụng thư viện react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Đừng quên import CSS



const ManageBooks = () => {
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editingBook, setEditingBook] = useState(null);
    const [isAddingBook, setIsAddingBook] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        bookToDelete: null
    });

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState(books);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;
    const [triggerFetch, setTriggerFetch] = useState(false);

    const fetchBooks = async () => {
        try {
            handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const data = await getAllBooks(accessToken);
            setBooks(data || []);
            setFilteredBooks(data || []);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    useEffect(() => {
        fetchBooks();
    }, [triggerFetch])

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const getCurrentBooks = () => {
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        return filteredBooks.slice(startIndex, endIndex);
    };

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

    const handleReadClick = (book) => {
        setSelectedBook(book);
    };

    const handleEditClick = (book) => {
        console.log(book);
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
        books.push(newBook); // Thêm sách mới vào danh sách
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
                    // Hiện thông báo toaster
                    toast.success("Xóa thành công");
                    setTimeout(() => {
                        fetchBooks();
                    }, 5000);
                } else {
                    toast.error('Xóa sách thất bại. Vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                toast.error('Đã xảy ra lỗi khi xóa sách. Vui lòng thử lại!');
            }
        }

        setDeleteConfirmation({
            isOpen: false,
            bookToDelete: null
        });
    };

    return (
        <div className="manage-books-content">
            <ToastContainer/>
            <div className="searchbar-option">
                <SearchBar
                    onSearch={handleSearch}
                    loading={loading}
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

                        {getCurrentBooks().map((book, index) => (
                            <tr key={book.id}>
                                <td>{index + 1}</td>
                                <td className="image-column">
                                    <img src={book.imageUrl} alt={book.title} />
                                    {book.title}
                                </td>
                                <td>{book.author}</td>
                                <td className='description-column' >{book.description}</td>
                                <td>{book.price}</td>
                                <td className='quantity'>{book.quantity}</td>
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
