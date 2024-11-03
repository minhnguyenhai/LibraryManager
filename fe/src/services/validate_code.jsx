import axios from "axios";

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

export default validation;