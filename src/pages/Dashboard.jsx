import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LineChart from '../components/LineChart/LineChart';
import Skeleton from '../components/Skeleton/Skeleton';
import AddDataForm from '../components/AddDataForm/AddDataForm';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/dashboard/records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { totalRevenue, totalExpenses, netProfit, profitMargin } = useMemo(() => {
    if (!data.length) return { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 };
    const rev = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const exp = data.reduce((acc, curr) => acc + curr.expenses, 0);
    const profit = rev - exp;
    const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;
    return { totalRevenue: rev, totalExpenses: exp, netProfit: profit, profitMargin: margin };
  }, [data]);

  return (
    <div className="fade-in">
      <header className="header">
        <div>
          <h1>Executive Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time financial performance</p>
        </div>
        <div className="status-badge profit">
          <span className="dot">●</span> Live
        </div>
      </header>

      {/* 1. TOP ROW: STAT CARDS */}
      <div className="dashboard-grid">
        <div className="stat-card col-span-3">
          <h4>Total Revenue</h4>
          <p className="value">${totalRevenue.toLocaleString()}</p>
          <span className="trend up">↗ 12% vs last week</span>
        </div>
        <div className="stat-card col-span-3">
          <h4>Total Expenses</h4>
          <p className="value">${totalExpenses.toLocaleString()}</p>
          <span className="trend down">↘ 5% higher</span>
        </div>
        <div className="stat-card col-span-3">
          <h4>Net Profit</h4>
          <p className="value" style={{ color: netProfit >= 0 ? '#10b981' : '#ef4444' }}>
            ${netProfit.toLocaleString()}
          </p>
          <span className="trend up">Stable</span>
        </div>
        <div className="stat-card col-span-3">
          <h4>Profit Margin</h4>
          <p className="value">{profitMargin}%</p>
          <span className="trend up">Healthy</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="dashboard-grid">
        {/* Main Chart - Takes 8 Columns */}
        <div className="widget col-span-8">
          <h3>Revenue History</h3>
          {loading ? <Skeleton width="100%" height="300px" /> : (
             data.length > 0 ? <LineChart data={data} /> : <p>No data found.</p>
          )}
        </div>

        {/* Side Widget (Add Form) - Takes 4 Columns */}
        <div className="widget col-span-4">
          <AddDataForm onDataAdded={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;