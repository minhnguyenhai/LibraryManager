import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addNewBorrow } from '../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../auth/login_register';

const AddBorrowModal = ({ onClose, onAdd }) => {
    const [newBorrow, setNewBorrow] = useState({
        userId: '',
        bookId: '',
        quantity: 1,
        borrowDate: '',
        dueDate: '',
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

    const handleAddBorrow = async() => {
        try {
            await handleRefreshToken();
            const accessToken=localStorage.getItem('access_token');
            const response= await addNewBorrow(newBorrow,accessToken);
            onAdd(response.borrow_record);
            alert('Thêm sách thành công');
            onclose();
        } catch (error) {
            alert('Đã xảy ra lỗi khi thêm. Vui lòng thử lại!');
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Thêm lượt mượn sách</h2>
                <form className="add-book-form">
                    <div className="form-group">
                        <label htmlFor="title">Mã người dùng</label>
                        <input
                            id="title"
                            type="text"
                            value={newBorrow.userId}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Mã sách</label>
                        <input
                            id="title"
                            type="text"
                            value={newBorrow.bookId}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Số lượng</label>
                        <input
                            id="quantity"
                            type="number"
                            value={newBorrow.quantity}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Ngày mượn</label>
                        <input
                            id="title"
                            type="date"
                            value={newBorrow.borrowDate}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Hạn trả</label>
                        <input
                            id="title"
                            type='date'
                            value={newBorrow.dueDate}
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
