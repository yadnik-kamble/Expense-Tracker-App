import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      alert('Registration Successful! Please Login.');
      onSwitchToLogin(); // Switch back to login view
    } catch (err) {
      alert(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <input 
          type="text" placeholder="Username" required 
          onChange={e => setFormData({...formData, username: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" required 
          onChange={e => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" required 
          onChange={e => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit">Sign Up</button>
        
        <p style={{ marginTop: '15px', color: '#888', fontSize: '0.9rem' }}>
          Already have an account? <span onClick={onSwitchToLogin} style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 'bold' }}>Login</span>
        </p>
      </form>
    </div>
  );
};

export default Register;