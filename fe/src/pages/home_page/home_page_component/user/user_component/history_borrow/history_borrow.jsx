import React, { useState, useEffect } from "react";
import "./history_borrow.css";
import { handleRefreshToken } from "../../../../../auth/login_register";

// Hàm tính trạng thái và màu sắc của mỗi mượn sách
const getStatus = (status) => {
  // Kiểm tra và trả về trạng thái và màu sắc tương ứng
  if (status === "borrowing") {
    return { status: "Đang mượn", color: "blue" };
  }
  if (status === "overdue") {
    return { status: "Quá hạn", color: "red" };
  }
  if (status === "returned-ontime") {
    return { status: "Đã trả", color: "green" };
  }
  // Trường hợp không xác định
  return { status: "Không xác định", color: "grey" };
};

// Hàm gọi API để lấy thông tin mượn sách
const fetchBorrowRecordsFromAPI = async (accessToken, userId) => {
  const response = await fetch(
    `https://librarymanager-aict.onrender.com/user/${userId}/borrowing`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Kiểm tra phản hồi và xử lý lỗi nếu có
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json(); // Trả về dữ liệu JSON
};

// Hàm xử lý dữ liệu sau khi nhận được từ API
const processBorrowRecords = (data) => {
  if (data.borrow_records) {
    return data.borrow_records.map((record) => {
      const statusData = getStatus(record.status); // Lấy trạng thái và màu sắc cho mỗi mượn
      return {
        ...record,
        statusText: statusData.status,
        statusColor: statusData.color,
      };
    });
  }
  throw new Error("Không có dữ liệu mượn sách");
};

const HistoryBorrow = () => {
  const [borrowRecords, setBorrowRecords] = useState([]); // Lưu trữ danh sách mượn sách
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm gọi API và xử lý dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await handleRefreshToken(); // Lấy lại token
        const accessToken = localStorage.getItem("access_token");
        const user = JSON.parse(localStorage.getItem("user_info"));
        const data = await fetchBorrowRecordsFromAPI(accessToken, user.id);
        const updatedRecords = processBorrowRecords(data);
        setBorrowRecords(updatedRecords); // Cập nhật danh sách mượn sách
      } catch (error) {
        setError(error.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Giao diện loading
  if (loading) {
    return <div className="centered-message">Loading...</div>;
  }

  // Giao diện lỗi
  if (error) {
    return (
      <div className="centered-message">
        Lỗi mất rồi, đăng nhập lại giúp tôi nhé
      </div>
    );
  }

  // Giao diện không có dữ liệu
  if (borrowRecords.length === 0) {
    return <div className="centered-message">No Data</div>;
  }

  // Giao diện chính: bảng thông tin mượn sách
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
              <td>{index + 1}</td>
              <td>{record.book_title}</td>
              <td>
                <img
                  src={record.book_img_url}
                  alt={record.book_title}
                  style={{ width: "50px", height: "75px", objectFit: "cover" }}
                />
              </td>
              <td>{record.quantity}</td>
              <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
              <td>{new Date(record.due_date).toLocaleDateString()}</td>
              <td>
                {record.return_date
                  ? new Date(record.return_date).toLocaleDateString()
                  : "Chưa trả"}
              </td>
              <td style={{ color: record.statusColor }}>{record.statusText}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryBorrow;
