import Footer from "./footer/Footer";
import Header from "./header/Header";

function DefaultLayout({children}){
    return (
    <div>
        <div>
        <Header/>
    </div>
    <div>
        {children}
    </div>
    <div>
        <Footer/>
    </div>
    </div>
    )
}

export default DefaultLayout