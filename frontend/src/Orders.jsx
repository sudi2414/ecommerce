import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";

const OrdersPage = () => {
    const [selectedTab, setSelectedTab] = useState("bought");
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [selectedTab]);

    const fetchOrders = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/orderslist", { type: selectedTab }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(res.data.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const gotoSellItem = () => {
        console.log('Sell Item');
        navigate('/sellpage');
    }

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        navigate('/signin');
    };

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
                    <Link to="/chatbot" style={styles.button}>Chatbot</Link>
                    <button style={styles.button} onClick={gotoSellItem}>Sell Item</button>
                    <button style={styles.button} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav> */}
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <h2 style={{ textAlign: "center", color: "#333" }}>Orders</h2>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    {["bought", "sold", "pending"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            style={{
                                padding: "10px 15px",
                                margin: "0 5px",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                backgroundColor: selectedTab === tab ? "#007BFF" : "#ddd",
                                color: selectedTab === tab ? "#fff" : "#333",
                                transition: "0.3s",
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    {orders.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#666" }}>No {selectedTab} orders found.</p>
                    ) : (
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {orders.map(({ _id, items, amount, status, sellerId, buyerId }) => (
                                <li
                                    key={_id}
                                    style={{
                                        backgroundColor: "#f9f9f9",
                                        padding: "15px",
                                        marginBottom: "10px",
                                        borderRadius: "5px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <p style={{ fontWeight: "bold", color: "#333" }}>Order ID: {_id}</p>
                                        <p
                                            style={{
                                                color: status === "pending" ? "orange" : status === "placed" ? "green" : "red",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {status}
                                        </p>
                                    </div>

                                    {/* Show Buyer if Sold, otherwise show Seller */}
                                    {selectedTab === "sold" ? (
                                        <p><strong>Buyer:</strong> {buyerId?.name} ({buyerId?.email})</p>
                                    ) : (
                                        <p><strong>Seller:</strong> {sellerId?.name} ({sellerId?.email})</p>
                                    )}

                                    <p><strong>Items:</strong> {items.map((item) => `${item.itemId.name} - $${item.itemId.price}`).join(", ")}</p>
                                    <p style={{ fontWeight: "bold", color: "#007BFF" }}>Total: ${amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
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
    }
};
export default OrdersPage;
