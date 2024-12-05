import React, { useState, useEffect } from 'react';
import './history_borrow.css'; // Đảm bảo rằng bạn có file CSS này để tạo kiểu cho bảng

// Hàm tính trạng thái và màu sắc
const getStatus = (borrowDate, dueDate, returnDate) => {
    const currentDate = new Date();  // Ngày hiện tại
    const due = new Date(dueDate); // Ngày hết hạn
    const returned = returnDate ? new Date(returnDate) : null; // Ngày trả sách (nếu có)

    // Trạng thái và màu sắc
    if (returned) {
        return { status: 'Đã trả', color: 'green' }; // Đã trả
    } else if (currentDate > due) {
        return { status: 'Quá hạn', color: 'red' }; // Quá hạn
    } else if (currentDate.toDateString() === due.toDateString()) {
        return { status: 'Đang mượn', color: 'yellow' }; // Đang mượn và sắp hết hạn
    } else {
        return { status: 'Đang mượn', color: 'blue' }; // Đang mượn
    }
};

const HistoryBorrow = () => {
    const [borrowRecords, setBorrowRecords] = useState([]); // Lưu trữ danh sách mượn sách
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); // Lỗi khi gọi API

    // Bộ dữ liệu giả
    const mockBorrowRecords = [
        {
            id: "1",
            book_id: "100",
            borrow_date: "2023-01-01",
            due_date: "2023-01-15",
            return_date: null, // Chưa trả
        },
        {
            id: "2",
            book_id: "101",
            borrow_date: "2023-02-01",
            due_date: "2023-02-14",
            return_date: "2023-02-10", // Đã trả
        },
        {
            id: "3",
            book_id: "102",
            borrow_date: "2023-03-01",
            due_date: "2023-03-15",
            return_date: null, // Chưa trả
        },
        {
            id: "4",
            book_id: "103",
            borrow_date: "2023-04-01",
            due_date: "2023-04-10",
            return_date: "2023-04-05", // Đã trả
        },
        {
            id: "5",
            book_id: "104",
            borrow_date: "2023-06-01",
            due_date: "2023-06-10",
            return_date: null, // Chưa trả
        }
    ];

    useEffect(() => {
        // Giả lập gọi API
        setLoading(true);

        // Mô phỏng xử lý API trả về dữ liệu
        setTimeout(() => {
            try {
                const updatedRecords = mockBorrowRecords.map(record => {
                    // Chuyển đổi thời gian mượn thành kiểu Date và xử lý trạng thái
                    const borrowDate = new Date(record.borrow_date);
                    const dueDate = new Date(record.due_date);
                    const returnDate = record.return_date ? new Date(record.return_date) : null;
                    const statusData = getStatus(borrowDate, dueDate, returnDate);

                    return {
                        ...record,
                        status: statusData.status,
                        statusColor: statusData.color,
                    };
                });
                setBorrowRecords(updatedRecords); // Lưu trữ vào state
            } catch (error) {
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        }, 1000); // Giả lập 1 giây cho API trả về
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sách ID</th>
                        <th>Ngày Mượn</th>
                        <th>Ngày Hạn Trả</th>
                        <th>Ngày Trả</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowRecords.map(record => (
                        <tr key={record.id}>
                            <td>{record.id}</td>
                            <td>{record.book_id}</td>
                            <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                            <td>{new Date(record.due_date).toLocaleDateString()}</td>
                            <td>{record.return_date ? new Date(record.return_date).toLocaleDateString() : 'Chưa trả'}</td>
                            <td style={{ color: record.statusColor }}>
                                {record.status}  {/* Hiển thị trạng thái */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryBorrow;
