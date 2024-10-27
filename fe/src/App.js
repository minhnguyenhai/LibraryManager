import logo from './logo.svg';
import './App.css';
import LoginRegister from './pages/auth/login_register';
import HomePage from './pages/home_page/home_page';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    // <div>
    //   <LoginRegister/>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />   {/* Đường dẫn mặc định */}
        <Route path="/homepage" element={<HomePage />} />  {/* Trang homepage */}
      </Routes>
    </Router>
  );
}

export default App;
