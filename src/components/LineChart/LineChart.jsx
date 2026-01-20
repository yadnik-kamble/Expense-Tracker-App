import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import './LineChart.css';

const LineChart = ({ data }) => {
  
  // Custom Tooltip that loops through all lines (payload)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Day: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {/* Capitalize first letter of dataKey (revenue -> Revenue) */}
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Financial Overview</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            
            <XAxis 
              dataKey="date" 
              stroke="#8b92a5" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#8b92a5" 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`} 
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2 }} />
            <Legend verticalAlign="top" height={36} iconType="circle"/>

            {/* Line 1: Revenue (Purple) */}
            <Line 
              name="Revenue"
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />

            {/* Line 2: Expenses (Red/Pink) */}
            <Line 
              name="Expenses"
              type="monotone" 
              dataKey="expenses" 
              stroke="#ec4899" 
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LineChart;