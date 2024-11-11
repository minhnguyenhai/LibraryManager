import axios from "axios";
const BASE_URL = 'https://your-api-domain.com';

const login = async (email, password) => {
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
            throw new Error(`Lỗi đăng nhập: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

const refrehToken= async(currentRefreshToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/reader/refresh`,{
            refresh_token:currentRefreshToken,
        });
        console.log(response.status);
        if(response.status===200){
            return response.data;
        }else{
            throw new Error(`Lỗi làm mới token: ${response.statusText}`)
        }
    } catch (error) {
        throw error;
    }
}

const logout=async(accessToken)=>{
    try {
        const response=await axios.post(`${BASE_URL}/reader/logout`,{},{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        });
        if(response.status===200){
            return true;
        }else{
            throw new Error(`Lỗi đăng xuất: ${response.statusText}`)
        }
    } catch (error) {
        throw error;
    }
}

const register = async (email, password, username) => {
    try {
        const response = await axios.post('URL_API_REGISTER', {
            email: email,
            password: password,
            username: username
        });

        if (response.status === 200) { 
            console.log('Đăng ký thành công:', response.data);
            return response.data;
        } else {
            console.error(`Lỗi: ${response.status} - ${response.statusText}`);
            throw new Error(`Lỗi đăng ký: ${response.status}`);
        }
    } catch (error) {
        console.error('Đăng ký thất bại:', error);
        throw error;
    }
};


const forgotPassword = async (email) => {
    try {
        const response = await axios.post("url_api/forgot-password", {
            email: email
        });

        console.log(response.status);
        if (response.status === 200) {
            console.log('Gửi yêu cầu khôi phục mật khẩu thành công:', response.data);
            return response.data;
        } else {
            console.error(`Lỗi: ${response.status} - ${response.statusText}`);
            throw new Error(`Lỗi gửi yêu cầu: ${response.status}`);
        }
    } catch (error) {
        console.error('Gửi yêu cầu khôi phục mật khẩu thất bại:', error);
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
export { login,refrehToken,logout, register, forgotPassword, validation, resetPassword };