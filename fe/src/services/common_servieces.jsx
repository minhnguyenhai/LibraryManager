import axios from "axios";
import Book from "../models/book";

export const BASE_URL = 'https://librarymanager-s6yc.onrender.com'

//Lấy danh sách tất cả sách.

export const getAllBooks = async (accessToken) => {
  try {
    console.log(accessToken);
    const response = await axios.get(
      `${BASE_URL}/book`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    console.log(response);
    if (response.status === 200) {
      return response.data.books.map((bookdata) => new Book(bookdata));
    } else {
      throw new Error(`Error: ${response.status}`)
    }
  } catch (error) {
    throw error;
  }
}

//searchBook
export const search = async (searchTearm, accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/book/search`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { query: searchTearm },
    });

    if (response.status === 200) {
      return response.data.books.map((bookdata) => new Book(bookdata));
    } else {
      throw new Error("Lỗi");
    }
  } catch (error) {
    console.error("Lỗi khi tìm kiếm:", error);
    throw error;
  }
}

//sửa thông tin tài khoản
export const updateAccount = async (accountId, newAccount, accessToken) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/user/${accountId}`,
      {
        name: newAccount.name,
        dob: newAccount.dob,
        gender: newAccount.gender,
        address: newAccount.address,
        phone_number: newAccount.phone_number
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    console.log(response)
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    throw (error);
  }
}

//xóa tài khoản
export const deleteAccount= async(accountId,accessToken)=>{
  try {
      const response=await axios.delete(
          `${BASE_URL}/user/${accountId}`,
          {
              headers:{
                  Authorization: `Bearer ${accessToken}`
              }
          }
      )
      console.log('phản hồi',response);
      if(response){
        return response.data;
      }
  } catch (error) {
      throw error;
  }
}