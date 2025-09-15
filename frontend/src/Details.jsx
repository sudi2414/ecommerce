import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const DeliverItems = () => {
    const [orders, setOrders] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const gotoSellItem = () => {
        console.log('Sell Item');
        navigate('/sellpage');
    }
    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        navigate('/signin');
    };

    const fetchOrders = async () => {
        try {
            console.log("Fetching orders");
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:8000/api/orders/deliver", {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Response:", response.data);

            if (response.data.success) {
                console.log("Orders:", response.data.orders);
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleOtpChange = (index, value) => {
        setOtpInputs({ ...otpInputs, [index]: value });
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            console.log("Completing order:", orderId);
            console.log("OTP:", otpInputs[orderId]);
            const token = localStorage.getItem("token");
            const response = await axios.post(`http://localhost:8000/api/orders/close/${orderId}`,
                { otp: otpInputs[orderId] }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            },
            );

            if (response.data.success) {
                alert("Order completed successfully!");
                setOrders(orders.filter(order => order.orderId !== orderId));
            } else {
                alert("Incorrect OTP, please try again.");
            }
        } catch (error) {
            console.error("Error completing order:", error);
        }
    };

    const handleCancelOrder = async (orderId, index) => {
        try {
            const response = await axios.post(`http://localhost:8000/api/orders/cancel`, { orderId }, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.data.success) {
                setOrders(orders.filter((_, i) => i !== index));
                alert("Order canceled successfully.");
            } else {
                alert("Failed to cancel order. Please try again.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("An error occurred. Please try again later.");
        }
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
            <div style={styles.container}>
                <h2>Deliver Items</h2>
                {orders.length === 0 ? (
                    <p>No pending orders.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Item Name</th>
                                <th style={styles.th}>Price</th>
                                <th style={styles.th}>Buyer</th>
                                <th style={styles.th}>Phone</th>
                                <th style={styles.th}>OTP</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{order.name || "N/A"}</td>
                                    <td style={styles.td}>${order.price || "N/A"}</td>
                                    <td style={styles.td}>{order.buyerName || "N/A"}</td>
                                    <td style={styles.td}>{order.buyerContact || "N/A"}</td>
                                    <td style={styles.td}>
                                        <input
                                            type="text"
                                            value={otpInputs[order.orderId] || ""}
                                            onChange={(e) => handleOtpChange(order.orderId, e.target.value)}
                                            style={styles.input}
                                        />
                                    </td>
                                    <td style={styles.td}>
                                        <button onClick={() => handleCompleteOrder(order.orderId)} style={styles.button1}>
                                            Complete
                                        </button>
                                        <button onClick={() => handleCancelOrder(order.orderId, index)} style={styles.cancelButton}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#f9f9f9",
        textAlign: "center",
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
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
    },
    th: {
        padding: "10px",
        border: "1px solid #ddd",
        background: "#4CAF50",
        color: "white",
        textAlign: "center",
    },
    td: {
        padding: "10px",
        border: "1px solid #ddd",
        textAlign: "center",
    },
    input: {
        padding: "5px",
        width: "80px",
        textAlign: "center",
    },
    button1: {
        padding: "8px 12px",
        background: "#28a745",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginRight: "5px",
    },
    cancelButton: {
        padding: "8px 12px",
        background: "#dc3545",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },
};

export default DeliverItems;
