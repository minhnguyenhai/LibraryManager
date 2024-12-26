import React, { useState, useEffect } from 'react';
import './history_borrow.css';
import { handleRefreshToken } from '../../../../../auth/login_register';

// Hàm tính trạng thái và màu sắc
const getStatus = (status) => {
    if (status === 'borrowing') {
        return { status: 'Đang mượn', color: 'blue' };
    }
    if (status === 'overdue') {
        return { status: 'Quá hạn', color: 'red' };
    }
    if (status === 'returned-ontime') {
        return { status: 'Đã trả', color: 'green' };
    }
    return { status: 'Không xác định', color: 'grey' };
};

const HistoryBorrow = () => {
    const [borrowRecords, setBorrowRecords] = useState([]); // Lưu trữ danh sách mượn sách
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 


    useEffect(() => {
        const fetchBorrowRecords = async () => {
            setLoading(true);
            setError(null);
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const user = JSON.parse(localStorage.getItem('user_info'));
            try {
                const response = await fetch(`https://librarymanager-s6yc.onrender.com/user/${user.id}/borrowing`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`, // Truyền token trực tiếp vào header
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data)
                if (data.borrow_records) {
                    const updatedRecords = data.borrow_records.map((record) => {
                        const statusData = getStatus(record.status);
                        return {
                            ...record,
                            statusText: statusData.status,
                            statusColor: statusData.color,
                        };
                    });
                    setBorrowRecords(updatedRecords); // Cập nhật danh sách mượn sách
                } else {
                    setError('Không thể tải dữ liệu.');
                }
            } catch (error) {
                setError(error.message || 'Đã xảy ra lỗi.');
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowRecords();
    }, []);

    if (loading) {
        return <div className="centered-message">Loading...</div>;
    }
    
    if (error) {
        return <div className="centered-message">Lỗi mất rồi, đăng nhập lại giúp tôi nhé</div>;
    }
    
    if (borrowRecords.length === 0) {
        return <div className="centered-message">No Data</div>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Sách</th>
                        <th>Hình ảnh</th>
                        <th>Số Lượng</th>
                        <th>Ngày Mượn</th>
                        <th>Ngày Hạn Trả</th>
                        <th>Ngày Trả</th>
                        <th>Trạng Thái</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowRecords.map((record, index) => (
                        <tr key={record.id}>
                            <td>{index + 1}</td> {/* Số thứ tự bắt đầu từ 1 */}
                            <td>{record.book_title}</td>
                            <td>
                             {/* Hiển thị hình ảnh */}
                                 <img 
                                 src={record.book_img_url} 
                                 alt={record.book_title} 
                                style={{ width: '50px', height: '75px', objectFit: 'cover' }} 
                                 />
                            </td>
                            <td>{record.quantity}</td>
                            <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                            <td>{new Date(record.due_date).toLocaleDateString()}</td>
                            <td>{record.return_date =="None"? '-':new Date(record.return_date).toLocaleDateString()}</td>
                            <td style={{ color: record.statusColor }}>
                                {record.statusText} {/* Hiển thị trạng thái */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryBorrow;
