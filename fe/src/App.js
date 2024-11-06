import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from './pages/auth/login_register';
import HomePage from './pages/home_page/home_page';
import DefaultLayout from './pages/layout/DefaultLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/home" element={<DefaultLayout><HomePage /></DefaultLayout>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
