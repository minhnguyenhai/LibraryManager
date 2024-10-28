import React, { useState, useEffect } from "react";
import "./history_borrow.css";
import { handleRefreshToken } from "../../../../../auth/login_register";

// Hàm tính trạng thái và màu sắc
const getStatus = (status) => {
  if (status === "borrowing") {
    return { status: "Đang mượn", color: "blue" };
  }
  if (status === "overdue") {
    return { status: "Quá hạn", color: "red" };
  }
  if (status === "returned-ontime") {
    return { status: "Đã trả", color: "green" };
  }
  return { status: "Không xác định", color: "grey" };
};

// Custom Hook: Lấy thông tin mượn sách từ API
const useBorrowRecords = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await handleRefreshToken();
        const accessToken = localStorage.getItem("access_token");
        const user = JSON.parse(localStorage.getItem("user_info"));

        if (!accessToken || !user) {
          throw new Error(
            "Token không hợp lệ hoặc thông tin người dùng không có"
          );
        }

        const response = await fetch(
          `https://librarymanager-aict.onrender.com/user/${user.id}/borrowing`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

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
          setBorrowRecords(updatedRecords);
        } else {
          throw new Error("Không có dữ liệu mượn sách");
        }
      } catch (error) {
        setError(error.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { borrowRecords, loading, error };
};

const HistoryBorrow = () => {
  const { borrowRecords, loading, error } = useBorrowRecords();

  if (loading) {
    return <div className="centered-message">Loading...</div>;
  }

  if (error) {
    return (
      <div className="centered-message">
        Lỗi mất rồi, đăng nhập lại giúp tôi nhé
      </div>
    );
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
