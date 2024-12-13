import React, { useEffect } from 'react';
import './borrow_history_modal.css'
const BorrowHistoryModal = ({selectedUserBorrowHistory, onClose }) => {
    const handleOverlayClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e) => {
        e.stopPropagation();
    };
    
    return (
        <div className="borrow-history-modal-overlay" onClick={handleOverlayClick}>
            <div className="borrow-history-modal-content"onClick={handleContentClick}>
                <div className="borrow-history-modal-header">
                    <h2>Lịch Sử Mượn Sách</h2>
                    <button 
                        className="close-modal-btn" 
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="borrow-history-modal-body">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên SÁCH</th>
                                <th style={{ width: '100px' }}>SỐ LƯỢNG</th>
                                <th>Ngày mượn</th>
                                <th>Hạn trả</th>
                                <th>Ngày trả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedUserBorrowHistory.map((borrow,index) => (
                                <tr key={borrow.id}>
                                    <td>{index+1}</td>
                                    <td>{borrow.book_title}</td>
                                    <td>{borrow.quantity}</td>
                                    <td>{borrow.borrowDate}</td>
                                    <td>{borrow.dueDate}</td>
                                    <td>{borrow.returnDate==='None'? "-": borrow.returnDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BorrowHistoryModal;