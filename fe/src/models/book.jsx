class Book {
    constructor(data) {
        this.id = data.id ;
        this.title = data.title ;
        this.author = data.author ;
        this.imageUrl = data.image_url ;
        this.description = data.description ;
        this.price = data.price ;
        this.quantity = data.quantity ;
      }

}

export default Book;