import axios from "axios";

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

export default forgotPassword;