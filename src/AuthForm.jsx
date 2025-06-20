import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async () => {
    const route = isSignup ? '/api/signup' : '/api/login';
    const payload = {
      username: form.username.trim().toLowerCase(),
      password: form.password,
    };

    try {
      const res = await axios.post(`http://localhost:5000${route}`, payload);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        onAuthSuccess();
      } else {
        alert(res.data.message || 'Signup successful. Please login.');
        if (isSignup) setIsSignup(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed!');
    }
  };

  return (
    <div style={styles.fullScreenWrapper}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        <p style={styles.toggleText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsSignup(!isSignup)} style={styles.link}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  fullScreenWrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#252B37',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    boxSizing: 'border-box',
  },
  formCard: {
    backgroundColor: '#1e1e1e',
    padding: 30,
    borderRadius: 10,
    maxWidth: 400,
    width: '100%',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    color: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
    border: '1px solid #444',
    backgroundColor: '#252B37',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#F7C71F',
    color: '#252B37',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: 16,
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 15,
  },
  link: {
    color: '#F7C71F',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default AuthForm;
