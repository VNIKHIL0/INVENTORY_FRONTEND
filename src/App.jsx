import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import AuthForm from './AuthForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', quantity: 0, price: 0 });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: token },
      });
      setProducts(res.data);
    } catch {
      alert('Session expired. Please log in again.');
      handleLogout();
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, newProduct, {
          headers: { Authorization: token }
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', newProduct, {
          headers: { Authorization: token }
        });
      }
      setNewProduct({ name: '', category: '', quantity: 0, price: 0 });
      fetchProducts();
    } catch {
      alert('Error saving product.');
    }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: token }
    });
    fetchProducts();
  };

  const editProduct = (product) => {
    setNewProduct(product);
    setEditingId(product._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  if (!token) {
    return <AuthForm onAuthSuccess={() => setToken(localStorage.getItem('token'))} />;
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const theme = {
    backgroundColor: darkMode ? '#252B37' : '#F7C71F',
    color: darkMode ? '#F7C71F' : '#252B37',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const inputStyle = {
    margin: '5px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #999',
    backgroundColor: darkMode ? '#1f1f1f' : '#fff',
    color: darkMode ? '#F7C71F' : '#252B37',
  };

  const buttonStyle = {
    margin: '5px',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: darkMode ? '#F7C71F' : '#252B37',
    color: darkMode ? '#252B37' : '#F7C71F',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={theme}>
      {/* 🔷 TOP NAV */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px'
      }}>
        <h2>📦 Inventory Dashboard</h2>
        <div>
          <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          <button onClick={() => setDarkMode(!darkMode)} style={buttonStyle}>
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* 🔶 SUMMARY */}
      <h3>Summary</h3>
      <p>Total Products: {products.length}</p>
      <p>Total Stock: {products.reduce((sum, p) => sum + p.quantity, 0)}</p>
      <p>Total Value: ₹{products.reduce((sum, p) => sum + (p.quantity * p.price), 0).toFixed(2)}</p>

      {/* 📝 FORM */}
      <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
      <input style={inputStyle} placeholder="Name" value={newProduct.name}
        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
      <input style={inputStyle} placeholder="Category" value={newProduct.category}
        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
      <input style={inputStyle} type="number" placeholder="Quantity" value={newProduct.quantity}
        onChange={e => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })} />
      <input style={inputStyle} type="number" placeholder="Price" value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
      <button style={buttonStyle} onClick={handleSubmit}>
        {editingId ? 'Update Product' : 'Add Product'}
      </button>

      {/* 🔍 SEARCH */}
      <h3>Search</h3>
      <input
        type="text"
        style={inputStyle}
        placeholder="Search by name or category"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* 📋 TABLE */}
      <h3>Product List</h3>
      <table style={{
        width: '100%',
        marginTop: '10px',
        borderCollapse: 'collapse',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        color: darkMode ? '#F7C71F' : '#252B37',
      }}>
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Qty</th><th>Price</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>
              <td>
                <button style={buttonStyle} onClick={() => editProduct(p)}>Edit</button>
                <button style={buttonStyle} onClick={() => deleteProduct(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
