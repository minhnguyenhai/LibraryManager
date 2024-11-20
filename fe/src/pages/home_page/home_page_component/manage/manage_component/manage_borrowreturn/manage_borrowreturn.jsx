import React, { useState } from 'react';
import SearchBar from '../../../search/search_bar';
import Pagination from '../../../pagination/pagination';
import './manage_borrowreturn.css'
import AddBorrowModal from '../../../add_borrow_modal/add_borrow_modal';

const generateBorrows = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        name: `Name ${index + 1}`,
        email: `Email ${index + 1}`,
        book: `Đừng ăn một mình`,
        start_date: "22/10/2005",
        deadline: "22/12/2005",
        date_return: "-",
        status: "Đang mượn",
    }));
};

const ManageBorrowReturn = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const borrowsPerPage = 10;
    const allBorrows = generateBorrows(100);
    const totalPages = Math.ceil(allBorrows.length / borrowsPerPage);
    const [isAddingBorrow, setIsAddingBorrow] = useState(false);

    const getCurrentBorrows = () => {
        const startIndex = (currentPage - 1) * borrowsPerPage;
        const endIndex = startIndex + borrowsPerPage;
        return allBorrows.slice(startIndex, endIndex);
    };

    const handleAddnewBorrow = () => {
        
    };
    return (
        <div className="manage-borrows-content">
            <div className="searchbar-option">
                <SearchBar />
                <button className="catalog-button" onClick={() => setIsAddingBorrow(true)} >Thêm người mượn sách</button>
            </div>
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

                        {getCurrentBorrows().map(borrow => (
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
                                        <button
                                        >
                                            Trả sách
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


        </div>
    );
};

export default ManageBorrowReturn;


