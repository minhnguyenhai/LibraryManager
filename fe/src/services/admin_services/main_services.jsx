import axios from "axios";

const BASE_URL = '';

//thêm sách mới
export const addBook = async (bookData, accessToken)=> {
    try {
        const response = await axios.post(
            `${BASE_URL}/add_book`,
            {
                title: bookData.title,
                author: bookData.author,
                image_url: bookData.imageUrl,
                description: bookData.description,
                price: bookData.price,
                quantity: bookData.quantity,
            },
            {
                header:{
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        )
        if(response.status===201){
            return response.data;
        }else{
            throw new Error(response.status);
        }
    } catch (error) {
        throw error;
    }
}

//sửa sách
export const updateBook =async(bookId,bookData,accessToken)=>{
    try {
        const response=await axios.put(
            `${BASE_URL}/update_book/${bookId}`,
            {
                title: bookData.title,
                author: bookData.author,
                image_url: bookData.imageUrl,
                description: bookData.description,
                price: bookData.price,
                quantity: bookData.quantity,
            },
            {
                header:{
                    Authorization:`Bearer ${accessToken}`
                }
            }
        )
        if (response.status===200){
            return response.data;
        }else{
            throw new Error(response.status);
        }
    } catch (error) {
        throw error;
    }
}

//xóa sách khỏi cơ sở dữ liệu

export const deleteBook= async(bookId,accessToken)=>{
    try {
        const response=await axios.delete(
            `${BASE_URL}/delete_book/${bookId}`,
            {
                header:{
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        return response;
    } catch (error) {
        throw error;
    }
}