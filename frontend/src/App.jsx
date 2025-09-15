import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SignIn from './Signin';
import SignUp from './Signup';
import './App.css';
import Dashboard from './Dashboard';
import Navbar from './Navbar';
import Home from './Home';
import Profile from './Profile';
import Itempage from './Itempage';
import SellItem from './Sellpage';
import Cart from './Cart';
import OrdersPage from './Orders';
import Details from './Details';
import Chatbot from './Chatbot';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(Cookies.get('token'));

  useEffect(() => {
    const storedToken = Cookies.get('token');
    setToken(storedToken);
    const currentPath = window.location.pathname;

    if (storedToken && (currentPath === '/signin' || currentPath === '/signup' || currentPath === '/')) {
      navigate('/profile');
    }
  }, [navigate]);

  return (
    <>
      {token && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        {/* <Route path="/home" element={<ProtectedRoute element={Home} />} /> */}
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/item/:id" element={<ProtectedRoute element={Itempage} />} />
        <Route path="/sellpage" element={<ProtectedRoute element={SellItem} />} />
        <Route path="/cart" element={<ProtectedRoute element={Cart} />} />
        <Route path="/orders" element={<ProtectedRoute element={OrdersPage} />} />
        <Route path="/details" element={<ProtectedRoute element={Details} />} />
        <Route path="/chatbot" element={<ProtectedRoute element={Chatbot} />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
};

// Protected Route Component
const ProtectedRoute = ({ element: Element }) => {
  const token = Cookies.get('token');
  return token ? <Element /> : <Navigate to="/signin" />;
};

export default App;
