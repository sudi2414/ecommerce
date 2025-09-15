import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
// import JWT from 'jsonwebtoken';

const SellItem = () => {
    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
        price: "",
        category: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const gotoSellItem = () => {
        console.log('Sell Item');
        navigate('/sellpage');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //   const token = Cookies.get("token");
            const token = localStorage.getItem('token');
            if (!token) {
                setError("User not authenticated. Please log in.");
                return;
            }

            console.log(formData);

            // const sellerId = JWT.verify(token, 'HGFHGEADFT12678'); 
            const response = await axios.post(
                "http://localhost:8000/api/sellitem",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(response.data);

            setSuccess("Item added successfully!");
            setFormData({
                itemName: "",
                description: "",
                price: "",
                category: "",
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add item.");
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
                    <button style={styles.button} onClick={() => {
                        Cookies.remove("token");
                        localStorage.removeItem("token");
                        navigate("/signin");
                    }}>Logout</button>
                </div>
            </nav> */}
            <div style={styles.container}>
                <h1 style={styles.heading}>Sell Item</h1>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Item Name:
                        <input
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </label>
                    <label style={styles.label}>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />
                    </label>
                    <label style={styles.label}>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </label>
                    <label style={styles.label}>
                        Category:
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            <option value="Grocery">Grocery</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Kitchenware">Kitchenware</option>
                            <option value="Books">Books</option>
                            <option value="Furniture">Furniture</option>
                        </select>
                    </label>
                    {/* <label style={styles.label}>
                        Stock Quantity:
                        <input
                            type="number"
                            name=""
                            value={formData.}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </label> */}
                    <button type="submit" style={styles.submitButton}>Submit</button>
                </form>
            </div>
        </>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Arial', sans-serif",
    },
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
    },
    heading: {
        textAlign: "center",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    label: {
        fontWeight: "bold",
        color: "#555",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        marginTop: "5px",
    },
    textarea: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        marginTop: "5px",
        resize: "vertical",
    },
    submitButton: {
        backgroundColor: "#007BFF",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    success: {
        color: "green",
        textAlign: "center",
    },
};

export default SellItem;
