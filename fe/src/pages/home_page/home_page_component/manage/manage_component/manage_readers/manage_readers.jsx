import React, { useEffect, useState } from 'react';
import SearchBar from '../../../search/search_bar';
import Pagination from '../../../pagination/pagination';
import ConfirmationDialog from '../../../confirmation_dialog/confirmation_dialog';
import { getUsers, searchAccount } from '../../../../../../services/admin_services/main_services';
import { handleRefreshToken } from '../../../../../auth/login_register';
import AccountDetailModal from '../../../account_detail_model/account_detail_modal';
import EditAccountModal from '../../../edit_account_modal/edit_account_modal';
import { deleteAccount } from '../../../../../../services/common_servieces';
import { toast, ToastContainer } from 'react-toastify';



const ManageReaders = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 10;
    const [allAccounts,setAllAccounts]=useState([]);
    
    
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        accountToDelete: null
    });

    const [filteredAccounts, setFilteredAccounts] = useState(allAccounts);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isOpenAccountModal, setIsOpenAccountModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(false);


    const fetchAccounts = async () => {
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const data = await getUsers(accessToken);
            setAllAccounts(data || []);
            setFilteredAccounts(data || []);
            console.log(filteredAccounts);
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }
    useEffect(() => {
        fetchAccounts();
    }, [refreshKey])
    
    const handleSearch = async (searchTerm) => {
        if (!searchTerm.trim()) {
            await fetchAccounts();
        }
        setLoading(true);
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem("access_token"); // Lấy JWT Token từ localStorage
            const results = await searchAccount(searchTerm, accessToken); // Gọi API tìm kiếm
            setFilteredAccounts(results); // Cập nhật kết quả tìm kiếm
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
    const getCurrentAccounts = () => {
        const startIndex = (currentPage - 1) * accountsPerPage;
        const endIndex = startIndex + accountsPerPage;
        return filteredAccounts.slice(startIndex, endIndex);
    };

    const handleViewDetails = (account) => {
        setSelectedUser(account);
        setIsOpenAccountModal(true);
    };
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };
    const handleDeleteClick = (account) => {
        setDeleteConfirmation({
            isOpen: true,
            accountToDelete: account
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmation.accountToDelete) {
            try {
                await handleRefreshToken();
                const accessToken = localStorage.getItem('access_token');
                const response = await deleteAccount(deleteConfirmation.accountToDelete.id, accessToken);

                if (response) {
                    // Hiện thông báo toaster
                    toast.success("Xóa thành công");
                    setTimeout(() => {
                        fetchAccounts();
                    }, 3000);
                } else {
                    toast.error('Xóa sách thất bại. Vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                toast.error('Đã xảy ra lỗi khi xóa sách. Vui lòng thử lại!');
            }
        }

        setDeleteConfirmation({
            isOpen: false,
            accountToDelete: null
        });
    };
    return (
        <div className="manage-accounts-content">
            <ToastContainer/>
            <div className="searchbar-option">
                <SearchBar 
                onSearch={handleSearch}
                loading={loading}
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

                        {getCurrentAccounts().map((account,index) => (
                            <tr key={account.id}>
                                <td>{index+1}</td>
                                <td>{account.email}</td>
                                <td>{account.name}</td>
                                <td>{account.dob}</td>
                                <td>{account.gender}</td>
                                <td>{account.address}</td>
                                <td>{account.phone_number}</td>
                                <td>
                                    <div className="button-option">
                                        <button onClick={()=>handleViewDetails(account)}
                                        >
                                            Xem thông tin
                                        </button>
                                        <button onClick={()=>handleEditClick(account)}
                                        >
                                            Sửa thông tin
                                        </button>
                                        <button onClick={()=> handleDeleteClick(account)}
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
            
            {isOpenAccountModal && (
                <AccountDetailModal
                    selectedUser={selectedUser}
                    onClose={() => setIsOpenAccountModal(false)}
                />
            )}

            {editModalOpen  && (
                <EditAccountModal
                    account={selectedUser}
                    onClose={() => setEditModalOpen(false)}
                    onSave={()=>setSelectedUser(null)}
                    triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
            )}
        </div>
    );
};

export default ManageReaders;
