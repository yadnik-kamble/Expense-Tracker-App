import React, { useState } from 'react';
import axios from 'axios';
import './AddDataForm.css';

const AddDataForm = ({ onDataAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    category: 'General',
    type: 'expense' // Default to expense
  });

  // 1. Define the API Base URL from environment variables
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const categories = ['Food & Dining', 'Transport', 'Utilities', 'Entertainment', 'Health', 'General', 'Salary', 'Freelance'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      // 2. UPDATED: Use API_URL here
      await axios.post(`${API_URL}/api/dashboard/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ ...formData, description: '', amount: '' }); // Reset fields
      if (onDataAdded) onDataAdded();
      alert('Transaction Added!');
    } catch (err) {
      console.error(err);
      alert('Error adding data');
    }
  };

  return (
    <div className="widget">
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Type Selector */}
        <div style={{ display: 'flex', gap: '10px' }}>
           <label style={{ flex: 1, cursor: 'pointer', background: formData.type === 'expense' ? '#ec4899' : '#333', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
             <input type="radio" name="type" value="expense" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} style={{ display: 'none' }} />
             Expense
           </label>
           <label style={{ flex: 1, cursor: 'pointer', background: formData.type === 'income' ? '#10b981' : '#333', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
             <input type="radio" name="type" value="income" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} style={{ display: 'none' }} />
             Income
           </label>
        </div>

        <input 
          type="text" 
          placeholder="Description (e.g. Grocery Shopping)" 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f1014', color: 'white' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
           <input 
             type="number" 
             placeholder="Amount" 
             value={formData.amount}
             onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
             required
             style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f1014', color: 'white' }}
           />
           <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f1014', color: 'white' }}
           >
             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
           </select>
        </div>

        <input 
          type="date" 
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          required
          style={{ padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#0f1014', color: 'white' }}
        />

        <button type="submit" style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddDataForm;