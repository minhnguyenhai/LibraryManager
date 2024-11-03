import axios from "axios";
const login=async(email, password) =>{
    try{
        const response= await axios.post("url_api",{
            email:email,
            password:password
        })
        console.log(response.status);
        if(response.status==200){
            console.log('Đăng nhập thành công: ',response.data);
            return response.data;
        }else{
            console.error(`Lỗi: ${response.status} - ${response.statusText}`);
            throw new Error(`Lỗi đăng nhập: ${response.status}`);
        }
    }catch(error){
        console.error('Đăng nhập thất bại:', error);
        throw error;
    }
}
export default login;