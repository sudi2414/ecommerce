import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    contactnumber: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const response = await axios.post("http://localhost:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchProfile();
  }, [refresh]);

  const gotoSellItem = () => {
    console.log('Sell Item');
    navigate('/sellpage');
  }
  const handleLogout = () => {
    Cookies.remove('token'); 
    localStorage.removeItem('token'); 
    navigate('/signin'); 
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData({ ...formData, [name]: value });
    } else {
      setPasswordData({ ...passwordData, [name]: value });
    }
  };

  const handleSaveDetails = async () => {
    try {
      await axios.post("http://localhost:8000/api/updateprofile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setIsEditing(false);
      setRefresh(prev => !prev);
      setSuccess("Details updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New password and confirm password do not match");
        return;
      }

      const response = await axios.post("http://localhost:8000/api/changepassword", passwordData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.message === "Incorrect current password") {
        setError("Incorrect current password. Please try again.");
      } else if (response.data.message === "New password and confirm password do not match") {
        setError("New password and confirm password do not match.");
      } else if (response.data.message === "Password updated successfully") {
        setSuccess("Password updated successfully");
        setError("");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setIsChangingPassword(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* <nav style={styles.navbar}>
        <h1 style={styles.logo}>E-Commerce</h1>

        <div style={styles.navButtons}>
          <Link to="/dashboard" style={styles.button1}>Dashboard</Link>
          <Link to="/profile" style={styles.button1}>Profile</Link>
          <Link to="/home" style={styles.button1}>Home</Link>
          <Link to="/cart" style={styles.button1}>Cart</Link>
          <Link to="/orders" style={styles.button1}>Orders</Link>
          <Link to="/details" style={styles.button1}>Details</Link>
          <Link to="/chatbot" style={styles.button1}>Chatbot</Link>
          <button style={styles.button1} onClick={gotoSellItem}>Sell Item</button>
          <button style={styles.button1} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav> */}
      <div style={styles.container}>
        <h1 style={styles.heading}>Profile</h1>
        {error && <div style={styles.error}>Error: {error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}
        {profile && (
          <>
            {!isEditing && !isChangingPassword && (
              <div style={styles.profileContainer}>
                <p><strong>First Name:</strong> {profile.firstname}</p>
                <p><strong>Last Name:</strong> {profile.lastname}</p>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Contact Number:</strong> {profile.contactnumber}</p>
                <button onClick={() => setIsEditing(true)} style={styles.button}>Edit Details</button>
                <button onClick={() => setIsChangingPassword(true)} style={styles.button}>Change Password</button>
              </div>
            )}

            {isEditing && (
              <div style={styles.formContainer}>
                <label style={styles.label}>First Name:
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.label}>Last Name:
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.label}>Age:
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.label}>Contact Number:
                  <input
                    type="text"
                    name="contactnumber"
                    value={formData.contactnumber}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <button onClick={handleSaveDetails} style={styles.formButton}>Save</button>
                <button onClick={() => setIsEditing(false)} style={styles.formCancelButton}>Cancel</button>
              </div>
            )}

            {isChangingPassword && (
              <div style={styles.formContainer}>
                <label style={styles.label}>Current Password:
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.label}>New Password:
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <label style={styles.label}>Confirm Password:
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                  />
                </label>
                <button onClick={handleChangePassword} style={styles.formButton}>Save</button>
                <button onClick={() => setIsChangingPassword(false)} style={styles.formCancelButton}>Cancel</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    textAlign: "center",
  }, navbar: {
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
  button1: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#fff',
    color: '#007BFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  heading: { fontSize: "28px", marginBottom: "20px", color: "#333" },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 5px",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 5px",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  cancelButtonHover: {
    backgroundColor: "#e53935",
  },
  error: {
    color: "#f44336",
    fontWeight: "bold",
    margin: "20px 0",
    padding: "12px",
    borderRadius: "5px",
    backgroundColor: "#ffe5e5",
  },
  profileContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "20px",
    textAlign: "left",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "flex-start",
    textAlign: "left",
  },
  formInput: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    width: "100%",
    marginBottom: "12px",
    boxSizing: "border-box",
  },
  label: {
    fontSize: "18px",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#555",
  },
  successMessage: {
    color: "#4CAF50",
    fontWeight: "bold",
    margin: "20px 0",
    padding: "12px",
    borderRadius: "5px",
    backgroundColor: "#e8f5e9",
  },
  formButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    transition: "background-color 0.3s",
  },
  formButtonHover: {
    backgroundColor: "#45a049", 
  },
  formCancelButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "16px",
    width: "100%",
    transition: "background-color 0.3s",
  },
  formCancelButtonHover: {
    backgroundColor: "#e53935", 
  },
  inputContainer: {
    width: "100%",
  },
  textCenter: {
    textAlign: "center",
  },
  profileContent: {
    marginTop: "20px",
  },
};

export default Profile;
