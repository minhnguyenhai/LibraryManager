import axios from "axios";
import { BASE_URL } from "../common_servieces";

export const addFavouriteBook= async(bookId,accessToken)=>{
    try {
        const response= await axios.post(
            `${BASE_URL}/user/favorite`,
            {
                book_id : bookId
            },
            {
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        console.log(response);
        if(response.status===200){
            return response.data;
        }else{
            throw new Error('Error');
        }
    } catch (error) {
        throw error;
    }
}
