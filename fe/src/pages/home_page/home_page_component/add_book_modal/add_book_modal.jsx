import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddBookModal = ({ onClose, onAdd }) => {
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        price: '',
        quantity: 1,
        description: '',
        imageUrl: ''
    });

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };


    const handleChange = (field, value) => {
        setNewBook({
            ...newBook,
            [field]: value
        });
    };

    const handleAddBook = () => {
        if (!newBook.title || !newBook.author || !newBook.price) {
            alert('Vui lòng điền đầy đủ thông tin sách!');
            return;
        }
        onAdd(newBook);
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Thêm Sách Mới</h2>
                <form className="add-book-form">
                    <div className="form-group">
                        <label htmlFor="title">Tên sách</label>
                        <input
                            id="title"
                            type="text"
                            value={newBook.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="author">Tác giả</label>
                        <input
                            id="author"
                            type="text"
                            value={newBook.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Giá</label>
                        <input
                            id="price"
                            type="text"
                            value={newBook.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng</label>
                        <input
                            id="quantity"
                            type="number"
                            value={newBook.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Mô tả</label>
                        <textarea
                            id="description"
                            value={newBook.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="imageUrl">URL Ảnh</label>
                        <input
                            id="imageUrl"
                            type="text"
                            value={newBook.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={handleAddBook}>
                            Thêm
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

AddBookModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default AddBookModal;