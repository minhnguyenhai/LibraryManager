import '../footer/Footer.css'
import image from '../../../assets/img/image.png'

function Footer(){
    return (
        <div className='wrapper'>
            <img src={image}/>
            <div className='contact'>
                Địa chỉ: 34, Hà Nội<br/>
                Mail: group34webhustsupport@gmail.com<br/>
                Điện thoại: (+84) 345 657 8888
            </div>
            <div className='box'>
                <p className='text-box'>
                Bản quyền thuộc về 4AM
                </p>
            </div>
        </div>
    )
}

export default Footer