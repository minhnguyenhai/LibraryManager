import React, { useState } from 'react';
import './return_book_modal.css'
import { returnBorrowBook } from '../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../auth/login_register';
import { toast } from 'react-toastify';
const ReturnBookModal = ({ borrow, onClose, onReturn,triggerRefresh }) => {
    const [returnBorrow, setReturnBorrow] = useState({...borrow});
    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    const handleChange = (field, value) => {
        setReturnBorrow({
            ...returnBorrow,
            [field]:value
        })
    };

    const handleSave = async()  => {
        try {
            await handleRefreshToken();
            const accessToken=localStorage.getItem('access_token');
            const response= await returnBorrowBook(returnBorrow.id,returnBorrow,accessToken);
            if(response){
                onReturn();
                onClose();
                toast.success("Trả sách thành công");
                setTimeout(() => {
                    triggerRefresh();
                }, 2000);
            }
        } catch (error) {
            toast.error("Trả sách thất bại. Vui lòng thử lại");
        }
    };


    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Trả sách</h2>
                <form className="edit-book-form">
                    <div className="form-group">
                        <label htmlFor="date">Ngày trả</label>
                        <input
                            id="date"
                            type="date"
                            value={returnBorrow.returnDate}
                            onChange={(e) => handleChange('returnDate', e.target.value)}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={handleSave}>
                            Xác nhận
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

export default ReturnBookModal;