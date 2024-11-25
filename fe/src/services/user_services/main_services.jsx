import axios from "axios";
import Book from "../../models/book";
const BASE_URL='';

//Lấy danh sách tất cả sách.

export const getAllBooks =async()=>{
    try {
        const response= await axios.get(
            `${BASE_URL}/get`
        )
        if(response.status===200){
            return response.data.books.map((bookdata)=>new Book(bookdata));
        }else{
            throw new Error(`Error: ${response.status}`)
        }
    } catch (error) {
        throw error;
    }
}

