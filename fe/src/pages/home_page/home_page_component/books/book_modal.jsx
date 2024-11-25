import React from 'react';
import PropTypes from 'prop-types';
import './book_list.css'
const BookModal = ({
    book,
    onClose,
    labels = {
        addToCart: 'Thêm vào danh sách yêu thích'
    }
}) => {
    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    if (!book) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="modal-image"
                />
                <h2 className="modal-title">{book.title}</h2>
                <p className="modal-author">{book.author}</p>
                <p className="modal-description">{book.description}</p>
                <div className="modal-footer">
                    <span className="book-price">{book.price}</span>
                    <button className="add-to-cart-button">
                        {labels.addToCart}
                    </button>
                </div>
            </div>
        </div>
    );
};

BookModal.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        author: PropTypes.string,
        price: PropTypes.string,
        imageUrl: PropTypes.string,
        description: PropTypes.string
    }),
    onClose: PropTypes.func.isRequired,
    labels: PropTypes.shape({
        addToCart: PropTypes.string
    })
};

export default BookModal;