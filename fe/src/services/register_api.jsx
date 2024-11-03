import axios from 'axios';

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

export default register;
