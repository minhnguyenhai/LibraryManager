import React, { useState } from 'react';
import SearchBar from '../../search/search_bar'; // Đảm bảo file này tồn tại
import Pagination from '../../pagination/pagination'; // Đảm bảo file này tồn tại
import './history_borrow.css'; // Đảm bảo file CSS này tồn tại
import AddBorrowModal from '../../add_borrow_modal/add_borrow_modal'; // Đảm bảo file này tồn tại

// Hàm tạo danh sách giả lập người mượn sách
const generateBorrows = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    email: `email${index + 1}@example.com`,
    book: `Đừng ăn một mình`,
    start_date: '22/10/2005',
    deadline: '22/12/2005',
    date_return: '-',
    status: 'Đang mượn',
  }));
};

const HistoryBorrow = () => {
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const borrowsPerPage = 10; // Số bản ghi mỗi trang
  const allBorrows = generateBorrows(100); // Danh sách người mượn
  const totalPages = Math.ceil(allBorrows.length / borrowsPerPage); // Tổng số trang
  const [isAddingBorrow, setIsAddingBorrow] = useState(false); // Trạng thái thêm người mượn

  // Lấy dữ liệu người mượn theo trang
  const getCurrentBorrows = () => {
    const startIndex = (currentPage - 1) * borrowsPerPage;
    const endIndex = startIndex + borrowsPerPage;
    return allBorrows.slice(startIndex, endIndex);
  };

  // Xử lý thêm người mượn mới
  const handleAddnewBorrow = (newBorrow) => {
    console.log('Người mượn mới:', newBorrow);
    // Logic thêm người mượn mới vào danh sách (hiện tại chỉ log ra console)
    // Nếu cần thêm vào danh sách, bạn có thể sử dụng useState để cập nhật `allBorrows`.
  };

  return (
    <div className="manage-borrows-content">
      <div className="searchbar-option">
        {/* Thanh tìm kiếm */}
        <SearchBar />

        {/* Nút thêm người mượn */}
        <button
          className="catalog-button"
          onClick={() => setIsAddingBorrow(true)}
        >
          Thêm người đã mượn sách
        </button>
      </div>

      {/* Bảng hiển thị danh sách người mượn */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người mượn</th>
              <th>Email</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentBorrows().map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.id}</td>
                <td>{borrow.name}</td>
                <td>{borrow.email}</td>
                <td>{borrow.book}</td>
                <td>{borrow.start_date}</td>
                <td>{borrow.deadline}</td>
                <td>{borrow.date_return}</td>
                <td>{borrow.status}</td>
                <td>
                  <div className="button-option">
                    <button>Trả sách</button>
                    <button>Gia hạn mượn sách</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        maxPagesToShow={5}
        labels={{
          previous: 'Trước',
          next: 'Sau',
          pageInfo: 'Trang {current} / {total}',
        }}
      />

      {/* Modal thêm người mượn */}
      {isAddingBorrow && (
        <AddBorrowModal
          onClose={() => setIsAddingBorrow(false)}
          onAdd={handleAddnewBorrow}
        />
      )}
    </div>
  );
};

export default HistoryBorrow;