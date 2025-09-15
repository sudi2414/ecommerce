import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const SITE_KEY = '6LdEx80qAAAAAEvJPQSaufki6jyewCXpvtFGsbW-';

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token); // Store reCAPTCHA response token
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        ...credentials,
        recaptchaToken, // Send reCAPTCHA response to backend
      });

      Cookies.set('token', response.data.refreshToken);
      localStorage.setItem('token', response.data.refreshToken);

      setSuccess('Login successful! Redirecting...');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password!');
    }
  };

  return (
    <>
      <div style={styles.navButtons}>
        <Link to="/signin" style={styles.button}>Sign In</Link>
        <Link to="/signup" style={styles.button}>Sign Up</Link>
      </div>

      <div style={styles.container1}>
        <h2 style={styles.header}>Sign In</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={styles.input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={styles.input} />

          <ReCAPTCHA sitekey={SITE_KEY} onChange={handleRecaptchaChange} />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button1}>Sign In</button>
        </form>
      </div>
    </>
  );
};

const styles = {
  navButtons: { display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' },
  button: { padding: '10px 20px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', borderRadius: '6px', textDecoration: 'none' },
  container1: { width: '400px', margin: '50px auto', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' },
  header: { textAlign: 'center', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' },
  error: { color: 'red', fontSize: '14px' },
  success: { color: 'green', fontSize: '14px' },
  button1: { padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', borderRadius: '4px', cursor: 'pointer' },
};

export default SignIn;
