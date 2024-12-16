import React, { useEffect, useState } from 'react';
import './edit_book_modal.css';
import { updateBook } from '../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../auth/login_register';
import { toast } from 'react-toastify';

const EditBookModal = ({ book, onClose, onSave,triggerRefresh }) => {
    const [editedBook, setEditedBook] = useState({ ...book });
    useEffect(() => {
        setEditedBook({ ...book });
    }, [book]);

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

    const handleSave = async()  => {
        try {
            console.log('Book',book)
            await handleRefreshToken();
            const accessToken=localStorage.getItem('access_token');
            const response= await updateBook(editedBook.id,editedBook,accessToken);
            if(response){
                onSave();
                onClose();
                toast.success("Sửa thông tin thành công");
                setTimeout(() => {
                    triggerRefresh();
                }, 2000);
            }

        } catch (error) {
            toast.error('Đã xảy ra lỗi cập nhật. Vui lòng thử lại');
        }
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
                        <label htmlFor="total_quantity">Tổng số lượng sách</label>
                        <input
                            id="total_quantity"
                            type="number"
                            value={editedBook.total_quantity}
                            onChange={(e) => handleChange('total_quantity', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="available_quantity">Số lượng sách hiện có</label>
                        <input
                            id="available_quantity"
                            type="number"
                            value={editedBook.available_quantity}
                            onChange={(e) => handleChange('available_quantity', e.target.value)}
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
                    <div className="form-group">
                        <label htmlFor="imageUrl">Link ảnh</label>
                        <input
                            id="imageUrl"
                            type="text"
                            value={editedBook.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
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


export default EditBookModal;
