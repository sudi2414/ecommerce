import React from 'react';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Navbar = () => {

  const navigate = useNavigate();

  const gotoSellItem = () => {
    console.log('Sell Item');
    navigate('/sellpage');
  }
  const handleLogout = () => {
    console.log('here in  logout');
    Cookies.remove('token');
    localStorage.removeItem('token');
    navigate('/signin');
  };
  return (
    <nav style={styles.navbar}>
      <h1 style={styles.logo}>E-Commerce</h1>
      <div style={styles.navButtons}>
        <Link to="/dashboard" style={styles.button}>Dashboard</Link>
        <Link to="/profile" style={styles.button}>Profile</Link>
        <Link to="/home" style={styles.button}>Home</Link>
        <Link to="/cart" style={styles.button}>Cart</Link>
        <Link to="/orders" style={styles.button}>Orders</Link>
        <Link to="/details" style={styles.button}>Details</Link>
        <Link to="/chatbot" style={styles.button}>Chatbot</Link>
        <button style={styles.button} onClick={gotoSellItem}>Sell Item</button>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navButtons: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#007BFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: '#007BFF',
    fontSize: '18px',
  },
};

export default Navbar;
