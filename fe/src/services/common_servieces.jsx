import axios from "axios";
import Book from "../models/book";

export const BASE_URL='https://librarymanager-aict.onrender.com'

//Lấy danh sách tất cả sách.

export const getAllBooks =async(accessToken)=>{
    try {
        console.log(accessToken);
        const response= await axios.get(
            `${BASE_URL}/book`,
            {
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            }
        )
        console.log(response);
        if(response.status===200){
            return response.data.books.map((bookdata)=>new Book(bookdata));
        }else{
            throw new Error(`Error: ${response.status}`)
        }
    } catch (error) {
        throw error;
    }
}

//searchBook
export const search=async(searchTearm,accessToken)=>{
    try {
      const response = await axios.get(`${BASE_URL}/book/search`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { query: searchTearm },
      });

      if (response.status===200) {
        return response.data.books.map((bookdata)=>new Book(bookdata));
      }else{
        throw new Error("Lỗi");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      throw error;
    }
}