import '../footer/Footer.css'
import image from "../../../../assets/img/image.png"
function Footer() {
    return (
        <div className='wrapper'>
            <img src={image} />
            <div className='contact'>
                Address: 34, Hà Nội<br />
                Mail: group34webhustsupport@gmail.com<br />
                Phone number: (+84) 345 657 8888
            </div>
            <div className='box'>
                <p className='text-box'>
                    © Copyright belongs to 4M
                </p>
            </div>
        </div>
    )
}

export default Footer