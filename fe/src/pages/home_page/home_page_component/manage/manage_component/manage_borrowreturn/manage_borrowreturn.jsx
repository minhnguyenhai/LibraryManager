import React, { useEffect, useState } from 'react';
import SearchBar from '../../../search/search_bar';
import Pagination from '../../../pagination/pagination';
import './manage_borrowreturn.css'
import AddBorrowModal from '../../../add_borrow_modal/add_borrow_modal';
import { getAllBorrow } from '../../../../../../services/admin_services/main_services';
import BorrowHistoryModal from '../../../borrow_history_modal/borrow_history_modal';
import ReturnBookModal from '../../../return_book_modal/return_book_modal';

const generateBorrows = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        user_id: `UserId ${index + 1}`,
        book_id: `BookId ${index + 200}`,
        quantity: 1,
        borrow_date: "22/10/2005",
        due_date: "22/12/2005",
        return_date: "-",
    }));
};

const ManageBorrowReturn = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const borrowsPerPage = 10;
    const allBorrows = generateBorrows(100);

    const [isAddingBorrow, setIsAddingBorrow] = useState(false);
    const [borrows, setBorrows] = useState([]);

    const fetchBorrows = async () => {
        try {
            const data = await getAllBorrow();
            setBorrows(data || []);
        } catch (e) {
            console.log(`Error: $e`);
        }
    }

    useEffect(() => {
        fetchBorrows();
    }, [])
    //lọc tài khoản
    const [filteredBorrows, setFilteredBorrows] = useState(allBorrows);

    const totalPages = Math.ceil(filteredBorrows.length / borrowsPerPage);

    const handleSearch = (searchResults) => {
        setFilteredBorrows(searchResults);
        setCurrentPage(1); // Reset to first page after search
    };

    const getCurrentBorrows = () => {
        const startIndex = (currentPage - 1) * borrowsPerPage;
        const endIndex = startIndex + borrowsPerPage;
        return filteredBorrows.slice(startIndex, endIndex);
    };
    const [selectedUserBorrowHistory, setSelectedUserBorrowHistory] = useState([]);
    const [isShowBorrowHistory, setIsShowBorrowHistory] = useState(false);

    const handleShowBorrowHistory = (userId) => {
        //Lọc lịch sử mượn của người dùng cụ thể
        const userHistory = filteredBorrows.filter(borrow => borrow.user_id === userId);
        console.log("User history:", userHistory);
        setSelectedUserBorrowHistory(userHistory);
        setIsShowBorrowHistory(true);
    };

    const handleAddnewBorrow = (newBorrow) => {
        allBorrows.push(newBorrow); // Thêm sách mới vào danh sách
        setIsAddingBorrow(false); // Đóng modal
    };
    const [selectedBorrowForReturn, setSelectedBorrowForReturn] = useState(null);

    const handleOpenReturnModal = (borrow) => {
        setSelectedBorrowForReturn(borrow);
    };

    const handleReturnBook = (updatedBorrowRecord) => {
        // Cập nhật record trong danh sách
        const updatedBorrows = borrows.map(borrow =>
            borrow.id === updatedBorrowRecord.id
                ? updatedBorrowRecord
                : borrow
        );
        setBorrows(updatedBorrows);
        setSelectedBorrowForReturn(null);
    };
    return (
        <div className="manage-borrows-content">
            <div className="searchbar-option">
                <SearchBar
                    onSearch={handleSearch}
                    data={allBorrows}
                    searchFields={['user_id', 'book_id']}
                />
                <button className="catalog-button" onClick={() => setIsAddingBorrow(true)} >Tạo lượt mượn sách</button>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>MÃ NGƯỜI DÙNG</th>
                            <th>MÃ SÁCH</th>
                            <th>SỐ LƯỢNG</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Ngày trả</th>
                            <th className='borrow-action'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>

                        {getCurrentBorrows().map(borrow => (
                            <tr key={borrow.id}>
                                <td>{borrow.id}</td>
                                <td>{borrow.user_id}</td>
                                <td>{borrow.book_id}</td>
                                <td className='quantity'>{borrow.quantity}</td>
                                <td>{borrow.borrow_date}</td>
                                <td>{borrow.due_date}</td>
                                <td>{borrow.return_date}</td>
                                <td>
                                    <div className="button-option">
                                        <button onClick={() => handleOpenReturnModal(borrow)}
                                        >
                                            Trả sách
                                        </button>
                                        <button onClick={() => handleShowBorrowHistory(borrow.user_id)}
                                        >
                                            Xem lịch sử mượn sách
                                        </button>
                                        <button
                                        >
                                            Gia hạn mượn sách
                                        </button>
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
                    pageInfo: 'Trang {current} / {total}'
                }}
            />

            {isAddingBorrow && (
                <AddBorrowModal
                    onClose={() => setIsAddingBorrow(false)}
                    onAdd={handleAddnewBorrow}
                />
            )}

            {isShowBorrowHistory && (
                <BorrowHistoryModal
                    userBorrowHistory={selectedUserBorrowHistory}
                    onClose={() => setIsShowBorrowHistory(false)}
                />
            )}

            {selectedBorrowForReturn && (
                <ReturnBookModal
                    borrow={selectedBorrowForReturn}
                    onClose={() => setSelectedBorrowForReturn(null)}
                    onReturn={handleReturnBook}
                />
            )}
        </div>
    );
};

export default ManageBorrowReturn;


