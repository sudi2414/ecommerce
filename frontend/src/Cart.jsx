import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [orderMessage, setOrderMessage] = useState('');
    const token = localStorage.getItem('token'); 

    const gotoSellItem = () => {
        console.log('Sell Item');
        navigate('/sellpage');
    }
    const handleLogout = () => {
        Cookies.remove('token'); 
        localStorage.removeItem('token'); 
        navigate('/signin'); 
    };
    
    const fetchCartItems = async () => {
        try {
            console.log('Fetching cart items');
            const res = await axios.post('http://localhost:8000/api/cart/ret', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(res.data);
            setCartItems(res.data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

    const removeItem = async (itemId) => {
        console.log('Removing item:', itemId);
        try {
            const res = await axios.post(`http://localhost:8000/api/cart/remove/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            console.log(res.data);
            fetchCartItems();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const orderItems = async () => {
        const itemIds = cartItems.map(item => item.itemId);
        try {
            console.log('Ordering items:', itemIds);
            const res = await axios.post('http://localhost:8000/api/order', { itemIds }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data);

            alert(`Order placed successfully! Your OTP: ${res.data.otp}`);

            setOrderMessage('Order placed successfully!');
            setCartItems([]);
        } catch (error) {
            console.error('Error in placing order:', error);
            setOrderMessage('Error placing order, please try again.');
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            {/* <nav style={styles.navbar}>
                <h1 style={styles.logo}>E-Commerce</h1>
                <div style={styles.navButtons}>
                    <Link to="/dashboard" style={styles.button}>Dashboard</Link>
                    <Link to="/profile" style={styles.button}>profile</Link>
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
            </nav> */}
            <div style={styles.cartContainer}>
                <h2>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p style={styles.emptyCart}>Cart is empty</p>
                ) : (
                    <>
                        <ul style={styles.cartList}>
                            {cartItems.map(({ itemId, name, price }) => (
                                <li key={itemId} style={styles.cartItem}>
                                    <span style={styles.itemName}>{name}</span>
                                    <span style={styles.itemPrice}>${price.toFixed(2)}</span>
                                    <button style={styles.removeBtn} onClick={() => removeItem(itemId)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div style={styles.cartFooter}>
                            <h3>Total: ${totalPrice.toFixed(2)}</h3>
                            <button style={styles.orderBtn} onClick={() => orderItems()}>Order Now</button>
                        </div>
                    </>
                )}
                {orderMessage && <p style={styles.orderStatus}>{orderMessage}</p>}
            </div>

        </>
    );
};

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#007BFF",
        color: "#fff",
    },
    logo: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    navButtons: {
        display: "flex",
        gap: "10px",
    },
    button: {
        padding: "8px 12px",
        fontSize: "14px",
        backgroundColor: "#fff",
        color: "#007BFF",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        textDecoration: "none",
    },
    cartContainer: {
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
    },
    cartList: {
        listStyle: "none",
        padding: "0",
    },
    cartItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ccc",
    },
    itemName: {
        fontWeight: "bold",
    },
    itemPrice: {
        color: "green",
    },
    removeBtn: {
        backgroundColor: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "5px",
    },
    cartFooter: {
        marginTop: "15px",
        textAlign: "center",
    },
    orderBtn: {
        backgroundColor: "blue",
        color: "white",
        padding: "10px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },
    orderStatus: {
        marginTop: "10px",
        color: "green",
        fontWeight: "bold",
    },
    emptyCart: {
        fontStyle: "italic",
        color: "gray",
    },
};


export default Cart;
