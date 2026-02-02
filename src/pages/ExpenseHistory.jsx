import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []); 

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    
    try {
      await axios.delete(`${API_URL}/api/dashboard/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from UI immediately
      setTransactions((prev) => prev.filter(tx => tx._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="fade-in">
      <header className="header">
        <div>
          <h1>Expense History</h1>
          <p style={{ color: 'var(--text-muted)' }}>View and manage all your transactions</p>
        </div>
      </header>

      <div className="widget" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#8b92a5' }}>
              <th style={{ padding: '20px' }}>Transaction</th>
              <th style={{ padding: '20px' }}>Category</th>
              <th style={{ padding: '20px' }}>Date</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '20px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} style={{ borderBottom: '1px solid #2a2d36' }}>
                <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: tx.type === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem'
                  }}>
                    {tx.type === 'expense' ? '💸' : '💰'}
                  </div>
                  <span style={{ fontWeight: '500' }}>{tx.description}</span>
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', background: '#2a2d36', color: '#ccc' }}>
                    {tx.category}
                  </span>
                </td>
                <td style={{ padding: '20px', color: '#8b92a5' }}>
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '20px', textAlign: 'right', fontWeight: 'bold', color: tx.type === 'expense' ? '#ef4444' : '#10b981' }}>
                  {tx.type === 'expense' ? '-' : '+'}${tx.amount.toLocaleString()}
                </td>
                <td style={{ padding: '20px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(tx._id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}
                    title="Delete Transaction"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;