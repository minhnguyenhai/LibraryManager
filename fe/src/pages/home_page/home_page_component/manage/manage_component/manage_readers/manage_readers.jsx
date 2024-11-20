import React, { useState } from 'react';
import SearchBar from '../../../search/search_bar';
import Pagination from '../../../pagination/pagination';

const generateAccounts = (count) => {
    return Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        email: `Email ${index + 1}`,
        author: `Author ${Math.floor(index / 5) + 1}`,
        name: `Name ${index + 1}`,
        dob: "22/10/2005",
        gender: "Male",
        address: "Đại học bách khoa Hà Nội",
        phone_number: "123456789",
    }));
};

const ManageReaders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const allAccounts = generateAccounts(100);
    const totalPages = Math.ceil(allAccounts.length / accountsPerPage);

    const getCurrentAccounts = () => {
        const startIndex = (currentPage - 1) * accountsPerPage;
        const endIndex = startIndex + accountsPerPage;
        return allAccounts.slice(startIndex, endIndex);
    };
    return (
        <div className="manage-accounts-content">
            <div className="searchbar-option">
                <SearchBar />
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Ngày sinh</th>
                            <th>Giới tính</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>

                        {getCurrentAccounts().map(account => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.email}</td>
                                <td>{account.name}</td>
                                <td>{account.dob}</td>
                                <td>{account.gender}</td>
                                <td>{account.address}</td>
                                <td>{account.phone_number}</td>
                                <td>
                                    <div className="button-option">
                                        <button
                                        >
                                            Xem thông tin
                                        </button>
                                        <button
                                        >
                                            Sửa thông tin
                                        </button>
                                        <button
                                        >
                                            Xóa
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

        </div>
    );
};

export default ManageReaders;
