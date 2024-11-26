class Borrow {
    constructor(data) {
        this.id = data.id;
        this.userId = data.uset_id;
        this.bookId = data.book_id;
        this.quantity = data.quantity;
        this.borrowDate = data.borrow_date;
        this.dueDate = data.due_date;
        this.returnDate = data.return_date;
    }
}

export default Borrow