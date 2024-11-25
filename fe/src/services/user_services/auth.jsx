import axios from "axios";
const BASE_URL = 'https://your-api-domain.com';
//đăng nhập
const userlogin = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/reader/login`,
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
const userrefrehToken= async(currentRefreshToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/reader/refresh-token`,{
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
const userlogout=async(accessToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/reader/logout`,{},{
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
        const response = await axios.post(`${BASE_URL}/reader/register`, {
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
        const response=await axios.post(`${BASE_URL}/reader/register`,{
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
        const response=await axios.post(`${BASE_URL}/reader/send-verification-code`,{
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
//quên mật khẩu
const forgotPassword = async (email) => {
    try {
        const response = await axios.post("url_api/forgot-password", {
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

const validation = async (code) => {
    try {
        const tokenforgot=localStorage.getItem('tokenforgot');
        const response = await axios.post("url_api/validate_code", {
            code: code,
            token:tokenforgot
        });

        console.log(response.status);
        if (response.status === 200) {
            console.log('Mã xác thực chính xác:', response.data);
            return response.data;
        } else {
            console.error(`Lỗi: ${response.status} - ${response.statusText}`);
            throw new Error(`Lỗi : ${response.status}`);
        }
    } catch (error) {
        console.error('Gửi mã xác thực thất bại:', error);
        throw error;
    }
}
const resetPassword = async (newPassword,confirmPassword) => {
    try {
        const tokenforgot=localStorage.getItem('tokenforgot');
        const response = await axios.post("url_api/reset_password", {
            newPassword: newPassword,
            token:tokenforgot
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

export { userlogin,userrefrehToken,userlogout, register,verify,resend_code, forgotPassword, validation, resetPassword };