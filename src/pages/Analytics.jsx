import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('/api/dashboard/records', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // Enhance data with "Profit" calculation for the Area Chart
        const enhancedData = res.data.map(item => ({
          ...item,
          profit: item.revenue - item.expenses
        }));
        setData(enhancedData);
      })
      .catch(err => console.error(err));
  }, []);

  // Calculate Aggregates for Pie Chart
  const { totalRevenue, totalExpenses } = useMemo(() => {
    const rev = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const exp = data.reduce((acc, curr) => acc + curr.expenses, 0);
    return { totalRevenue: rev, totalExpenses: exp };
  }, [data]);

  const pieData = [
    { name: 'Expenses', value: totalExpenses },
    { name: 'Profit Margin', value: totalRevenue - totalExpenses > 0 ? totalRevenue - totalExpenses : 0 }
  ];

  const COLORS = ['#ec4899', '#10b981']; // Pink for Expense, Green for Profit

  return (
    <div className="fade-in">
      <header className="header" style={{ marginBottom: '30px' }}>
        <h1>Analytics Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into your financial performance</p>
      </header>

      {/* Grid Layout */}
      <div className="dashboard-grid">
        
        {/* ROW 1: Main Bar Chart (Takes 8 columns) */}
        <div className="widget col-span-8" style={{ height: '400px' }}>
          <h3>Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#8b92a5" />
              <YAxis stroke="#8b92a5" />
              <Tooltip 
  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} /* <--- THIS FIXES THE GREY BOX */
  contentStyle={{ backgroundColor: '#1e2128', borderColor: '#333' }}
  itemStyle={{ color: '#fff' }}
/>
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ec4899" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROW 1: Pie Chart (Takes 4 columns) */}
        <div className="widget col-span-4" style={{ height: '400px' }}>
          <h3>Efficiency Ratio</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e2128', borderColor: '#333' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: '20px', color: '#8b92a5', fontSize: '0.9rem' }}>
            {((totalExpenses / totalRevenue) * 100).toFixed(1)}% of Revenue is spent on Expenses.
          </div>
        </div>

        {/* ROW 2: Area Chart (Full Width) */}
        <div className="widget col-span-12" style={{ height: '350px' }}>
          <h3>Net Profit Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#8b92a5" />
              <YAxis stroke="#8b92a5" />
              <Tooltip contentStyle={{ backgroundColor: '#1e2128', borderColor: '#333' }} />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorProfit)" 
                name="Net Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;