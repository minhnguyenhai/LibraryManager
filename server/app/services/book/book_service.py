from models import Book, db
from sqlalchemy.exc import SQLAlchemyError

# Lấy danh sách tất cả sách
def get_all_books():
    # Trả về tất cả sách dưới dạng danh sách dictionary
    return [book.as_dict() for book in Book.query.all()]

# Tạo sách mới
def create_book(data):
    try:
        # Khởi tạo đối tượng Book với dữ liệu từ request
        book = Book(
            name=data["name"],
            author=data["author"],
            total_quantity=data["total_quantity"],
            available_quantity=data["available_quantity"]
        )
        db.session.add(book)  # Thêm sách vào session
        db.session.commit()  # Lưu thay đổi vào cơ sở dữ liệu
        return book.as_dict()  # Trả về dữ liệu sách mới tạo dưới dạng dictionary
    except SQLAlchemyError as e:
        db.session.rollback()  # Khôi phục session nếu có lỗi xảy ra
        raise e  # Ném lỗi để xử lý ở lớp trên

def update_book(book_id, data):
    book = Book.query.get(book_id)
    if book:
        book.name = data.get("name", book.name)
        book.author = data.get("author", book.author)
        book.total_quantity = data.get("total_quantity", book.total_quantity)
        book.available_quantity = data.get("available_quantity", book.available_quantity)
        db.session.commit()
        return book.as_dict()
    return None

def delete_book(book_id):
    book = Book.query.get(book_id)
    if book:
        db.session.delete(book)
        db.session.commit()
        return True
    return False
