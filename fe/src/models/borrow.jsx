class Borrow {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.bookId = data.book_id;
        this.quantity = data.quantity;
        this.borrowDate = data.borrow_date;
        this.dueDate = data.due_date;
        this.returnDate = data.return_date;
        this.status = data.status;
        this.user_name=data.user_name;
        this.user_email=data.user_email;
        this.book_title=data.book_title;
    }
}

export default Borrow