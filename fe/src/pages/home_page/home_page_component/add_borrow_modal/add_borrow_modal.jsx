// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
// import { addNewBorrow } from '../../../../services/admin_services/main_services';
// import { handleRefreshToken } from '../../../auth/login_register';

// const AddBorrowModal = ({ onClose, onAdd }) => {
//     const [newBorrow, setNewBorrow] = useState({
//         userId: '',
//         bookId: '',
//         quantity: 1,
//         borrowDate: '',
//         dueDate: '',
//     });

//     const handleOverlayClick = (e) => {
//         e.stopPropagation();
//         onClose();
//     };

//     const handleContentClick = (e) => {
//         e.stopPropagation();
//     };

//     const handleChange = (field, value) => {
//         setNewBorrow({
//             ...newBorrow,
//             [field]: value
//         });
//     };

//     const handleAddBorrow = async () => {
//         if (!newBorrow.userId || !newBorrow.bookId || !newBorrow.borrowDate || !newBorrow.dueDate) {
//             alert('Vui lòng điền đầy đủ thông tin!');
//             return;
//         }
//         try {
//             await handleRefreshToken();
//             const accessToken = localStorage.getItem('access_token');
//             const response = await addNewBorrow(newBorrow, accessToken);
//             onAdd(response.borrow_record);
//             alert('Thêm sách thành công');
//             onClose();
//         } catch (error) {
//             alert('Đã xảy ra lỗi khi thêm. Vui lòng thử lại!');
//         }
//     };

//     return (
//         <div className="modal-overlay" onClick={handleOverlayClick}>
//             <div className="modal-content" onClick={handleContentClick}>
//                 <button className="modal-close" onClick={onClose}>×</button>
//                 <h2 className="modal-title">Thêm lượt mượn sách</h2>
//                 <form className="add-book-form">
//                     <div className="form-group">
//                         <label htmlFor="userId">Người dùng</label>
//                         <input
//                             id="userId"
//                             type="text"
//                             value={newBorrow.userId}
//                             onChange={(e) => handleChange('userId', e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="bookId">Tên sách</label>
//                         <input
//                             id="bookId"
//                             type="text"
//                             value={newBorrow.bookId}
//                             onChange={(e) => handleChange('bookId', e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="quantity">Số lượng</label>
//                         <input
//                             id="quantity"
//                             type="number"
//                             value={newBorrow.quantity}
//                             onChange={(e) => handleChange('quantity', e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="borrowDate">Ngày mượn</label>
//                         <input
//                             id="borrowDate"
//                             type="date"
//                             value={newBorrow.borrowDate}
//                             onChange={(e) => handleChange('borrowDate', e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="dueDate">Hạn trả</label>
//                         <input
//                             id="dueDate"
//                             type="date"
//                             value={newBorrow.dueDate}
//                             onChange={(e) => handleChange('dueDate', e.target.value)}
//                             required
//                         />
//                     </div>

//                     <div className="form-actions">
//                         <button type="button" onClick={handleAddBorrow}>
//                             Thêm
//                         </button>
//                         <button type="button" onClick={onClose}>
//                             Hủy
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// AddBorrowModal.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     onAdd: PropTypes.func.isRequired,
// };

// export default AddBorrowModal;

import React, { useState, useEffect } from 'react';
import './add_borrow_modal.css'
import PropTypes from 'prop-types';
import { addNewBorrow, getUsers } from '../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../auth/login_register';
import { getAllBooks } from '../../../../services/common_servieces';
import { toast } from 'react-toastify';

const AddBorrowModal = ({ onClose, onAdd, triggerRefresh }) => {
    const [newBorrow, setNewBorrow] = useState({
        userId: '',
        bookId: '',
        quantity: 1,
        borrowDate: '',
        dueDate: '',
    });

    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await handleRefreshToken();
                const accessToken = localStorage.getItem('access_token');

                // Fetch dữ liệu sách và người dùng
                const booksData = await getAllBooks(accessToken);
                const usersData = await getUsers(accessToken);

                setBooks(booksData);
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                alert('Không thể tải dữ liệu. Vui lòng thử lại!');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (field, value) => {
        setNewBorrow({
            ...newBorrow,
            [field]: value
        });
    };

    const handleAddBorrow = async () => {
        if (!newBorrow.userId || !newBorrow.bookId || !newBorrow.borrowDate || !newBorrow.dueDate) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const response = await addNewBorrow(newBorrow, accessToken);
            if (response) {
                onAdd();
                onClose();
                toast.success("Thêm lượt mượn thành công");
                setTimeout(() => {
                    triggerRefresh();
                }, 5000);
            }
        } catch (error) {
            toast.error("Thêm lượt mượn thất bại. Vui lòng thử lại");
        }
    };

    return (
        <div className="modal-overlay" onClick={() => onClose()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {loading && <p>Đang tải dữ liệu...</p>}
                <button className="modal-close" onClick={onClose}>×</button>
                <h2 className="modal-title">Thêm lượt mượn sách</h2>
                <form className="add-book-form">
                    <div className="form-group">
                        <label htmlFor="userId">Người dùng</label>
                        <select
                            id="userId"
                            value={newBorrow.userId}
                            onChange={(e) => handleChange('userId', e.target.value)}
                            required
                        >
                            <option value="">Chọn người dùng</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bookId">Tên sách</label>
                        <select
                            id="bookId"
                            value={newBorrow.bookId}
                            onChange={(e) => handleChange('bookId', e.target.value)}
                            required
                        >
                            <option value="">Chọn sách</option>
                            {books.map((book) => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
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
                        <label htmlFor="borrowDate">Ngày mượn</label>
                        <input
                            id="borrowDate"
                            type="date"
                            value={newBorrow.borrowDate}
                            onChange={(e) => handleChange('borrowDate', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dueDate">Hạn trả</label>
                        <input
                            id="dueDate"
                            type="date"
                            value={newBorrow.dueDate}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                            required
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
    onAdd: PropTypes.func.isRequired,
};

export default AddBorrowModal;
