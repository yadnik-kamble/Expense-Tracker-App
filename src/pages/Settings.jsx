import React from 'react';

const Settings = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="fade-in">
      <header className="header">
        <h1>Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your preferences</p>
      </header>

      <div className="widget-container" style={{ background: 'var(--card-bg)', padding: '30px', borderRadius: '12px', maxWidth: '500px' }}>
        <h3>User Profile</h3>
        <p style={{ color: '#888', marginBottom: '20px' }}>
          This is a protected route
        </p>
        
        <button 
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout Session
        </button>
      </div>
    </div>
  );
};

export default Settings;