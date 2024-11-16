import React from 'react';
import PropTypes from 'prop-types';
import './pagination.css'
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    maxPagesToShow = 5,
    labels = {
        previous: 'Trước',
        next: 'Sau',
        pageInfo: 'Trang {current} / {total}'
    }
}) => {
    // Xử lý scroll to top khi chuyển trang
    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Tính toán các số trang cần hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= maxPagesToShow) {
            // Nếu tổng số trang ít hơn maxPagesToShow, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pageNumbers.push(1);

            // Tính toán range của các trang giữa
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Thêm dấu ... nếu cần
            if (start > 2) {
                pageNumbers.push('...');
            }

            // Thêm các trang giữa
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            // Thêm dấu ... và trang cuối
            if (end < totalPages - 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {labels.previous}
            </button>

            {getPageNumbers().map((number, index) => (
                <button
                    key={index}
                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    onClick={() => typeof number === 'number' ? handlePageChange(number) : null}
                    disabled={typeof number !== 'number'}
                >
                    {number}
                </button>
            ))}

            <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {labels.next}
            </button>

            <span className="pagination-info">
                {labels.pageInfo
                    .replace('{current}', currentPage)
                    .replace('{total}', totalPages)}
            </span>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    maxPagesToShow: PropTypes.number,
    labels: PropTypes.shape({
        previous: PropTypes.string,
        next: PropTypes.string,
        pageInfo: PropTypes.string
    })
};

export default Pagination