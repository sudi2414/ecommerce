import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.post('http://localhost:8000/api/items', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setItems(response.data);
        setFilteredItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, selectedCategories);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    applyFilters(searchTerm, updatedCategories);
  };

  const applyFilters = (search, categories) => {
    let results = items;

    if (search) {
      results = results.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categories.length > 0) {
      results = results.filter((item) => categories.includes(item.category));
    }

    setFilteredItems(results);
  };

  return (
    <>
      <div style={styles.container}>
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

        <div style={styles.content}>
          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarHeader}>Filters</h3>
            <div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                style={styles.searchBar}
              />
            </div>
            <h4>Categories</h4>
            <ul style={styles.filterList}>
              {['Grocery', 'Clothing', 'Electronics', 'Accessories', 'Mobiles', 'Footwear', 'Kitchenware', 'Books', 'Furniture'].map((category) => (
                <li key={category}>
                  <label>
                    <input
                      type="checkbox"
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </aside>

          <main style={styles.main}>
            <h2 style={styles.mainHeader}>Available Items</h2>
            {loading ? (
              <p>Loading items...</p>
            ) : filteredItems.length > 0 ? (
              <div style={styles.itemGrid}>
                {filteredItems.map((item) => (
                  <div key={item._id} style={styles.itemCard}>
                    <img
                      src={`https://via.placeholder.com/150?text=${item.name}`}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                    <h3 style={styles.itemTitle}>{item.name}</h3>
                    <p style={styles.itemPrice}>${item.price}</p>
                    {/* <p>Vendor: {item.vendor}</p> */}
                    <Link to={`/item/${item._id}`} style={styles.addToCart}>
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items match your search or filter criteria.</p>
            )}
          </main>
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
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '20%',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRight: '1px solid #ddd',
  },
  main: {
    flex: 1,
    padding: '20px',
  },
  mainHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
  },
  itemCard: {
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  itemImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '10px',
    borderRadius: '8px',
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  itemPrice: {
    color: '#007BFF',
    marginBottom: '10px',
  },
  itemDescription: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
  },
  addToCart: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchBar: {
    padding: '8px',
    width: '100%',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};



export default Dashboard;
