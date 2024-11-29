import axios from "axios";
const BASE_URL = 'https://your-api-domain.com';
//đăng nhập
const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/login`,
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
//refresh token
const refrehToken= async(currentRefreshToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/user/refresh-token`,{
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
//đăng xuất
const logout=async(accessToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/user/logout`,{},{
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
//đăng ký
const register = async (email, password, name,dob,gender,address,phone_number) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/register`, {
            email: email,
            password: password,
            name: name,
            dob:dob,
            gender:gender,
            address:address,
            phone_number:phone_number
        });
        console(response.status);
        if (response.status === 201) { 
            return response.data;
        } else {
            throw new Error(`Lỗi đăng ký: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
};

//xác thực email
const verify = async(confirm_token,verification_code)=>{
    try {
        const response=await axios.post(`${BASE_URL}/user/verify-email`,{
            confirm_token:confirm_token,
            verification_code:verification_code
        })
        if(response===200){
            return response.data;
        }else{
            throw new Error(`Lỗi xác thực: ${response.status}`)
        }
    } catch (error) {
        throw error;
    }
}
//gửi lại mã xác thực
const resend_code =async (email)=>{
    try {
        const response=await axios.post(`${BASE_URL}/user/send-verification-code`,{
            email:email
        });
        console.log(response.status);
        if(response.status===200){
            return response.data;
        }else{
            throw new Error(`Lỗi gửi lại mã xác thực`);
        }
    } catch (error) {
        throw error;
    }
}
//yêu cầu đặt lại mật khẩu
const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/user/request-reset-password`, {
            email: email
        });

        console.log(response.status);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Lỗi gửi yêu cầu: ${response.status}`);
        }
    } catch (error) {
        throw error;
    }
}
//đặt mật khẩu mới
const resetPassword = async (newPassword,tempAccessToken) => {
    try {
        const response = await axios.post("url_api/reset_password", {
            new_password: newPassword,
            temp_access_token:tempAccessToken
        });

        console.log(response.status);
        if (response.status === 200) {
            console.log('Đổi mật khẩu thành công', response.data);
            return response.data;
        } else {
            console.error(`Lỗi: ${response.status} - ${response.statusText}`);
            throw new Error(`Lỗi : ${response.status}`);
        }
    } catch (error) {
        console.error('Đổi mật khẩu thất bại:', error);
        throw error;
    }
}
export { login,refrehToken,logout, register,verify,resend_code, forgotPassword, resetPassword };