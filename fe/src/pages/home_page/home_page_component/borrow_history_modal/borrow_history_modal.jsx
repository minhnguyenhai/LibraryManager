import React from 'react';
import './borrow_history_modal.css'
const BorrowHistoryModal = ({userBorrowHistory,  onClose }) => {
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
                                <th>MÃ SÁCH</th>
                                <th>SỐ LƯỢNG</th>
                                <th>Ngày mượn</th>
                                <th>Hạn trả</th>
                                <th>Ngày trả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userBorrowHistory.map(borrow => (
                                <tr key={borrow.id}>
                                    <td>{borrow.id}</td>
                                    <td>{borrow.book_id}</td>
                                    <td>{borrow.quantity}</td>
                                    <td>{borrow.borrow_date}</td>
                                    <td>{borrow.due_date}</td>
                                    <td>{borrow.return_date}</td>
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