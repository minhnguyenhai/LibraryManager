import React, { useEffect, useState } from 'react';
import SearchBar from '../../../search/search_bar';
import Pagination from '../../../pagination/pagination';
import ConfirmationDialog from '../../../confirmation_dialog/confirmation_dialog';
import { getUsers } from '../../../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../../../auth/login_register';



const ManageReaders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [allAccounts,setAllAccounts]=useState([]);
    
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
    });

    const [filteredAccounts, setFilteredAccounts] = useState(allAccounts);
    const fetchAccounts = async () => {
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            console.log('trước',accessToken)
            const data = await getUsers(accessToken);
            console.log('sau')
            setAllAccounts(data || []);
            setFilteredAccounts(data || []);
            console.log(filteredAccounts);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
    useEffect(() => {
        fetchAccounts();
    }, [])
    const handleSearch = (searchResults) => {
        setFilteredAccounts(searchResults);
        setCurrentPage(1); // Reset to first page after search
    };

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
    const getCurrentAccounts = () => {
        const startIndex = (currentPage - 1) * accountsPerPage;
        const endIndex = startIndex + accountsPerPage;
        return filteredAccounts.slice(startIndex, endIndex);
    };

    const handleDeleteClick = () => {
        setDeleteConfirmation({
            isOpen: true,
        });
    };

    const handleConfirmDelete = () => {
        // Đóng modal
        setDeleteConfirmation({
            isOpen: false,
        });
    };
    return (
        <div className="manage-accounts-content">
            <div className="searchbar-option">
                <SearchBar 
                onSearch={handleSearch}
                data={allAccounts}
                searchFields={['email','name','phone_number']}
                />
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
                                        <button onClick={()=> handleDeleteClick()}
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

            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false,})}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa không?`}
                confirmLabel="Xóa"
                cancelLabel="Hủy"
            />
        </div>
    );
};

export default ManageReaders;
