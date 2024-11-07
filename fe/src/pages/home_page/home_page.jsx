import React from "react";
import './home_page.css';
import Header from "./home_page_component/header/header";
import Footer from "./home_page_component/footer/Footer";
const HomePage =() =>{
    return(
        <div className="home-page">
            <Header/>
            <div className="body-content">
                
            </div>
            <Footer/>
        </div>
    )
}
export default HomePage