import axios from "axios";

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

export default resetPassword;