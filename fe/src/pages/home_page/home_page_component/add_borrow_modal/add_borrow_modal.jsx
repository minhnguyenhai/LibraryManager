import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddBorrowModal = ({ onClose, onAdd }) => {
    const [newBorrow, setNewBorrow] = useState({
        name: '',
        email: '',
        book: '',
        start_date: '',
        deadline: '',
    });

    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };


    const handleChange = (field, value) => {
        setNewBorrow({
            ...newBorrow,
            [field]: value
        });
    };

    const handleAddBorrow = () => {

        onAdd(newBorrow);
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Thêm Người Mượn Mới</h2>
                <form className="add-book-form">
                    <div className="form-group">
                        <label htmlFor="title">Người mượn </label>
                        <input
                            id="title"
                            type="text"
                            value={newBorrow.name}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Email</label>
                        <input
                            id="title"
                            type="text"
                            value={newBorrow.email}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tên sách</label>
                        <input
                            id="title"
                            type="text"
                            value={newBorrow.book}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Ngày mượn</label>
                        <input
                            id="title"
                            type="date"
                            value={newBorrow.start_date}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Hạn trả</label>
                        <input
                            id="title"
                            type='date'
                            value={newBorrow.deadline}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleAddBorrow}>
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

AddBorrowModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired
};

export default AddBorrowModal;
