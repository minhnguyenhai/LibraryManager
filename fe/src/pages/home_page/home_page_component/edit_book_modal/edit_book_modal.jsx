import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './edit_book_modal.css';

const EditBookModal = ({ book, onClose, onSave }) => {
    const [editedBook, setEditedBook] = useState({ ...book });

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleChange = (field, value) => {
        setEditedBook({
            ...editedBook,
            [field]: value
        });
    };

    const handleSave = () => {
        onSave(editedBook);
        onClose();
    };

    if (!book) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Chỉnh sửa thông tin sách</h2>
                <form className="edit-book-form">
                    <div className="form-group">
                        <label htmlFor="title">Tên sách</label>
                        <input
                            id="title"
                            type="text"
                            value={editedBook.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Tác giả</label>
                        <input
                            id="author"
                            type="text"
                            value={editedBook.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Giá</label>
                        <input
                            id="price"
                            type="text"
                            value={editedBook.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng</label>
                        <input
                            id="quantity"
                            type="number"
                            value={editedBook.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            value={editedBook.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={handleSave}>
                            Lưu
                        </button>
                        <button type="button" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

EditBookModal.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.string,
        quantity: PropTypes.number,
        imageUrl: PropTypes.string,
        description: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
};

export default EditBookModal;
