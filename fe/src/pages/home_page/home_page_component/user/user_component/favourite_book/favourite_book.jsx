import React, { useState, useEffect } from 'react';
import './favourite_book.css'; 

// Dữ liệu giả cho sách yêu thích
const mockFavouriteBooks = [
    {
        id: "1",
        title: "Sách 1",
        url_image: "https://via.placeholder.com/150",
        note: "Sách rất hay, tôi thích cách tác giả phát triển câu chuyện."
    },
    {
        id: "2",
        title: "Sách 2",
        url_image: "https://via.placeholder.com/150",
        note: "Một cuốn sách thú vị về khoa học."
    },
    {
        id: "3",
        title: "Sách 3",
        url_image: "https://via.placeholder.com/150",
        note: "Sách rất phù hợp với những ai yêu thích lịch sử."
    },
    {
        id: "4",
        title: "Sách 4",
        url_image: "https://via.placeholder.com/150",
        note: "Tôi đọc cuốn sách này rất nhiều lần, mỗi lần lại khám phá ra điều mới mẻ."
    },
    {
        id: "5",
        title: "Sách 5",
        url_image: "https://via.placeholder.com/150",
        note: "Đây là một cuốn sách tuyệt vời để học về kỹ năng sống."
    }
];

const FavouriteBooks = () => {
    const [favouriteBooks, setFavouriteBooks] = useState([]); 
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); 

    // Giả lập gọi API
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            try {
                
                setFavouriteBooks(mockFavouriteBooks);
            } catch (error) {
                setError('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        }, 1000); // Giả lập 1 giây cho API trả về
    }, []);

 
    const handleNoteChange = (id, newNote) => {
        const updatedBooks = favouriteBooks.map(book => 
            book.id === id ? { ...book, note: newNote } : book
        );
        setFavouriteBooks(updatedBooks); 
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sách</th>
                        <th>Hình ảnh</th>
                        <th>Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {favouriteBooks.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.title}</td>
                            <td className="image-column">
                                <img src={book.url_image} alt={book.title} />
                            </td>
                            <td>
                                <NoteInput 
                                    initialNote={book.note} 
                                    onNoteChange={(newNote) => handleNoteChange(book.id, newNote)} 
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Component nhập và lưu ghi chú
const NoteInput = ({ initialNote, onNoteChange }) => {
    const [note, setNote] = useState(initialNote);

 
    const handleInputChange = (event) => {
        setNote(event.target.value);
    };

 
    const handleBlur = () => {
        onNoteChange(note); 
    };

    return (
        <textarea 
            value={note} 
            onChange={handleInputChange} 
            onBlur={handleBlur}
            rows="3" 
            cols="30"
        />
    );
};

export default FavouriteBooks;
