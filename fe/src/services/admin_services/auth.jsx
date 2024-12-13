import axios from "axios";
const BASE_URL = 'https://your-api-domain.com';
//đăng nhập
const adminlogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/login`,
            {
                email: email,
                password: password,
            },
        )
        console.log(response.status);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Lỗi đăng nhập: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
}
//đăng xuất
const adminlogout=async(accessToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/admin/logout`,{},{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        });
        if(response.status===204){
            return true;
        }else{
            throw new Error(`Lỗi đăng xuất: ${response.status}`)
        }
    } catch (error) {
        throw error;
    }
}
const adminrefrehToken= async(currentRefreshToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/admin/refresh-token`,{
            refresh_token:currentRefreshToken,
        });
        console.log(response.status);
        if(response.status===200){
            return response.data;
        }else{
            throw new Error(`Lỗi làm mới token: ${response.status}`)
        }
    } catch (error) {
        throw error;
    }
}
export  {adminlogin,adminlogout,adminrefrehToken}