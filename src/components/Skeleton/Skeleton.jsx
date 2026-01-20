import React from 'react';
import { motion } from 'framer-motion';
import './Skeleton.css';

const Skeleton = ({ width, height }) => {
  return (
    <motion.div 
      className="skeleton-box"
      style={{ width, height }}
      animate={{ 
        backgroundPosition: ["-200% 0", "200% 0"] 
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "linear" 
      }}
    />
  );
};

export default Skeleton;  