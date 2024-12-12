import React, { useState, useEffect } from 'react';
import './favourite_book.css'; 

const FavouriteBooks = () => {
    const [favouriteBooks, setFavouriteBooks] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    // Quản lý trạng thái của modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);

    // Lấy JWT token từ localStorage
    const token = localStorage.getItem('jwtToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWNmOTNiMTAtYzY4NC00MzVmLTk3NjQtMmRmODMxNGZjYzExIiwiZXhwIjoxNzM0MDE1NzA3fQ.z5mYImqCCMWXfoq9hRznYUn2sioIzoQE30BVDzTy5Uo';

    useEffect(() => {
        const fetchFavouriteBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!token) {
                    throw new Error('Vui lòng đăng nhập.');
                }

                const response = await fetch('https://librarymanager-aict.onrender.com/user/favorite', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('No Data.');
                }

                const data = await response.json();
                setFavouriteBooks(data.books || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavouriteBooks();
    }, [token]);

    const openModal = (id) => {
        setSelectedBookId(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBookId(null);
    };

    const handleDeleteBook = async () => {
        try {
            const response = await fetch(`https://librarymanager-aict.onrender.com/user/favorite/${selectedBookId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Không thể xóa sách.');
            }

            setFavouriteBooks(favouriteBooks.filter(book => book.id !== selectedBookId));
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };

    // Hiển thị trạng thái
    if (loading) {
        return <div className="centered-message">Loading...</div>;
    }

    if (error) {
        return <div className="centered-message">{error}</div>;
    }

    if (favouriteBooks.length === 0) {
        return <div className="centered-message">Không có sách yêu thích để hiển thị.</div>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sách</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {favouriteBooks.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td className="image-column">
                                <img src={book.url_image || 'https://via.placeholder.com/150'} alt={book.title} />
                            </td>
                            <td>
                                <button 
                                    onClick={() => openModal(book.id)} 
                                    className="delete-button"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Bạn chắc chắn muốn xóa sách này chứ?</h3>
                        <div className="modal-buttons">
                            <button onClick={closeModal} className="cancel-button">
                                Không
                            </button>
                            <button onClick={handleDeleteBook} className="confirm-button">
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavouriteBooks;
