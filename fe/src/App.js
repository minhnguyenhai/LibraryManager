import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/auth/login_register';
import HomePage from './pages/home_page/home_page';

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/login" element={<LoginRegister />} />
    //     <Route path="/home" element={<HomePage />} />
    //     <Route path="/" element={<Navigate to="/login" />} />
    //   </Routes>
    // </BrowserRouter>
    <HomePage/>
  );
}

export default App;
