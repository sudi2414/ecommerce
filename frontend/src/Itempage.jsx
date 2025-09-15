import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const ItemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seller, setSeller] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.post(`http://localhost:8000/api/item/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const sell = response.data.sellerId;
                const res = await axios.post('http://localhost:8000/api/seller', { sell }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                

                setSeller(res.data);
                setItem(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching item:', error);
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const addToCart = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/cart/add',
                {
                    itemId: item._id,
                    itemPrice: item.price,
                    itemSeller: seller._id,
                    itemName: item.name,
                    quantity: 1,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(response.data.message);

            setMessage(response.data.message);
            setIsError(false);
        } catch (error) {
            setMessage('Error adding item to cart');
            setIsError(true);
        }

        setTimeout(() => setMessage(''), 3000);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        navigate('/signin');
    };

    if (loading) return <p style={styles.loading}>Loading...</p>;
    if (!item) return <p style={styles.error}>Item not found</p>;

    return (
        <>
            {/* <nav style={styles.navbar}>
                <h1 style={styles.logo}>E-Commerce</h1>
                <div style={styles.navButtons}>
                    <Link to="/dashboard" style={styles.button}>Dashboard</Link>
                    <Link to="/profile" style={styles.button}>Profile</Link>
                    <Link to="/home" style={styles.button}>Home</Link>
                    <Link to="/cart" style={styles.button}>Cart</Link>
                    <Link to="/orders" style={styles.button}>Orders</Link>
                    <Link to="/details" style={styles.button}>Details</Link>
                    <button style={styles.button}>Sell Item</button>
                    <button style={styles.button} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav> */}

            <div style={styles.container}>
                <h1>{item.name}</h1>
                {/* <img src={item.imageUrl} alt={item.name} style={styles.image} /> */}
                <p style={styles.price}>Price: <strong>${item.price}</strong></p>
                <p style={styles.description}>Description: {item.description}</p>
                <p style={styles.category}>Category: {item.category}</p>

                <div style={styles.sellerInfo}>
                    <h3>Vendor Information</h3>
                    <p><strong>Name:</strong> {seller.firstname} {seller.lastname}</p>
                    <p><strong>Email:</strong> {seller.email}</p>
                    <p><strong>Phone:</strong> {seller.contactnumber}</p>
                </div>

                <button onClick={addToCart} style={styles.addToCart}>Add to Cart</button>
                {message && (
                    <p style={{ ...styles.notification, ...(isError ? styles.errorMessage : styles.successMessage) }}>
                        {message}
                    </p>
                )}
            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '20px auto',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        maxWidth: '400px',
        borderRadius: '10px',
        marginBottom: '20px',
    },
    addToCart: {
        padding: '12px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '0.3s',
    },
    addToCartHover: {
        backgroundColor: '#0056b3',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
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
        padding: '10px 15px',
        fontSize: '14px',
        backgroundColor: '#fff',
        color: '#007BFF',
        border: '1px solid #007BFF',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: '0.3s',
    },
    buttonHover: {
        backgroundColor: '#007BFF',
        color: '#fff',
    },
    sellButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    price: {
        fontSize: '20px',
        color: '#28a745',
    },
    description: {
        fontSize: '16px',
        color: '#555',
    },
    category: {
        fontSize: '16px',
        color: '#777',
    },
    sellerInfo: {
        backgroundColor: '#e9ecef',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'left',
    },
    notification: {
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '16px',
    },
    successMessage: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
    },
    errorMessage: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
    },
    loading: {
        fontSize: '18px',
        textAlign: 'center',
    },
    error: {
        fontSize: '18px',
        color: '#dc3545',
        textAlign: 'center',
    },
};

export default ItemPage;
