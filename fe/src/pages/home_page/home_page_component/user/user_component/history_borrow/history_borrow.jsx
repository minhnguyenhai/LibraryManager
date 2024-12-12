import React, { useState, useEffect } from 'react';
import './history_borrow.css';

// Hàm tính trạng thái và màu sắc
const getStatus = (status) => {
    if (status === 'borrowing') {
        return { status: 'Đang mượn', color: 'blue' };
    }
    if (status === 'overdue') {
        return { status: 'Quá hạn', color: 'red' };
    }
    if (status === 'returned') {
        return { status: 'Đã trả', color: 'green' };
    }
    return { status: 'Không xác định', color: 'grey' };
};

const HistoryBorrow = () => {
    const [borrowRecords, setBorrowRecords] = useState([]); // Lưu trữ danh sách mượn sách
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 

    // Token và userId được truyền trực tiếp
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWNmOTNiMTAtYzY4NC00MzVmLTk3NjQtMmRmODMxNGZjYzExIiwiZXhwIjoxNzM0MDA1MTczfQ.WQXaQljUxOmCP4O6vPWQL74GUdBi2LaQXe-t6xMiLLI";
    const userId = "9cf93b10-c684-435f-9764-2df8314fcc11";

    useEffect(() => {
        const fetchBorrowRecords = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://librarymanager-aict.onrender.com/user/${userId}/borrowing`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Truyền token trực tiếp vào header
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

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
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (borrowRecords.length === 0) {
        return <div>Không có lịch sử mượn sách để hiển thị.</div>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Sách</th>
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
                            <td>{record.quantity}</td>
                            <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                            <td>{new Date(record.due_date).toLocaleDateString()}</td>
                            <td>{record.return_date ? new Date(record.return_date).toLocaleDateString() : 'Chưa trả'}</td>
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
