import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Chatbot = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const sessionId = "unique-session-id";

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const res = await axios.post('http://localhost:8000/api/chatbot', { sessionId, message: input });
            setMessages([...newMessages, { role: 'bot', text: res.data.reply }]);
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    const gotoSellItem = () => {
        navigate('/sellpage');
    };

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
                    <button style={styles.button} onClick={handleLogout}>Logout</button>
                </div>
            </nav> */}
            <div style={styles.chatContainer}>
                <h3 style={styles.header}>Chat Support</h3>
                <div style={styles.messagesContainer}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.message,
                                ...(msg.role === 'user' ? styles.userMessage : styles.botMessage),
                            }}
                        >
                            <p style={styles.messageText}>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.sendButton}>Send</button>
                </div>
            </div>
        </>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'blue',
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
        color: '#4CAF50',
        border: '1px solid #4CAF50',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#45a049',
        color: '#fff',
    },
    chatContainer: {
        width: '400px',
        height: '550px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fefefe',
        margin: '20px auto',
        padding: '15px',
    },
    header: {
        textAlign: 'center',
        margin: '0 0 15px 0',
        color: '#333',
        fontSize: '22px',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    message: {
        margin: '8px 0',
        padding: '10px',
        borderRadius: '8px',
        maxWidth: '80%',
        wordWrap: 'break-word',
    },
    userMessage: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#e1f5e9',
        color: '#333',
        alignSelf: 'flex-start',
    },
    messageText: {
        margin: 0,
        fontSize: '14px',
    },
    inputContainer: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
    },
    sendButton: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
};

export default Chatbot;
