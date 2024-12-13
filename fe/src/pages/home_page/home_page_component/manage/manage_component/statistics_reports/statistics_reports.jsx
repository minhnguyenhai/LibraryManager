import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; 
import "./statistics_reports.css"; 
import { handleRefreshToken } from '../../../../../auth/login_register';
import { statisticlBook, statisticlUser } from '../../../../../../services/admin_services/main_services';

const StatisticsReports = () => {
    const [userStats, setUserStats] = useState({});
    const [bookStats, setBookStats] = useState({});
    const fetchStatistic = async () => {
        try {
            await handleRefreshToken();
            const accessToken = localStorage.getItem('access_token');
            const user = await statisticlUser(accessToken);
            const book = await statisticlBook(accessToken);
            if (user) {
                setUserStats({
                    total: user.total_users,
                    new: user.new_users_this_month,
                    borrowing: user.users_borrowing,
                });
            }
            if (book) {
                setBookStats({
                    total: book.total_books,
                    new: book.new_books_this_month,
                    borrowed: book.books_borrowed,
                });
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        fetchStatistic();
    }, []);

    const userChartData = {
        labels: ["Tổng người dùng", "Người dùng mới", "Đang mượn sách"],
        datasets: [
            {
                label: "Thống kê người dùng",
                data: [userStats.total, userStats.new, userStats.borrowing],
                backgroundColor: ["#4caf50", "#ff9800", "#2196f3"],
            },
        ],
    };

    const bookChartData = {
        labels: ["Tổng sách", "Sách mới", "Sách đang mượn"],
        datasets: [
            {
                label: "Thống kê sách",
                data: [bookStats.total, bookStats.new, bookStats.borrowed],
                backgroundColor: ["#673ab7", "#e91e63", "#00bcd4"],
            },
        ],
    };

    const userChartOptions = {
        plugins: {
            legend: {
                display: false, // Tắt hiển thị label
            },
        },
    };
    
    const bookChartOptions = {
        plugins: {
            legend: {
                display: false, // Tắt hiển thị label
            },
        },
    };

    
    return (
        <div className="statistics-container">
            {/* <h1 className="statistics-title">Thống kê thư viện</h1> */}
            <div className="statistics-section">
                <h2>Thống kê người dùng</h2>
                <Bar data={userChartData}  options={userChartOptions} />
            </div>
            <div className="statistics-section">
                <h2>Thống kê sách</h2>
                <Bar data={bookChartData}  options={bookChartOptions}/>
            </div>
        </div>
    );
};

export default StatisticsReports;
