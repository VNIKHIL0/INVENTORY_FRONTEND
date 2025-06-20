import React from 'react';

const Navbar = ({ onLogout, darkMode, toggleDarkMode }) => {
  return (
    <nav style={{
      backgroundColor: darkMode ? '#252B37' : '#F7C71F',
      color: darkMode ? '#F7C71F' : '#252B37',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <h2>📦 Inventory App</h2>
      <div>
        <button onClick={toggleDarkMode} style={{
          marginRight: 20,
          background: 'none',
          border: `2px solid ${darkMode ? '#F7C71F' : '#252B37'}`,
          padding: '5px 12px',
          borderRadius: 6,
          color: darkMode ? '#F7C71F' : '#252B37',
          cursor: 'pointer'
        }}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button onClick={onLogout} style={{
          backgroundColor: darkMode ? '#F7C71F' : '#252B37',
          color: darkMode ? '#252B37' : '#F7C71F',
          border: 'none',
          padding: '6px 14px',
          borderRadius: 6,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
