import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: '',
  });
  const [error, setError] = useState(''); // For validation errors
  const [success, setSuccess] = useState(''); // For success messages

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    const validDomains = /@(students\.iiit\.ac\.in|research\.iiit\.ac\.in)$/;
    return validDomains.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email domain
    if (!validateEmail(formData.email)) {
      setError('Email must end with students.iiit.ac.in or research.iiit.ac.in');
      return;
    }

    try {
      // API call to register the user
      // console.log(formData);
      const response = await axios.post('http://localhost:8000/api/signup', formData);
      setSuccess('Sign-up successful! You can now sign-in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error during sign-up!');
    }
  };

  return (
    <>


      <div style={styles.navButtons}>
        <Link
          to="/signin"
          style={{ ...styles.button }}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          style={{ ...styles.button }}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Sign Up
        </Link>
      </div>

      <div style={styles.container}>
        <h2 style={styles.header}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="IIIT Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

const styles = {
  navButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease', 
    textDecoration: 'none', 
    fontWeight: 'bold', 
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  container: {
    width: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
  },
  
};

export default SignUp;
