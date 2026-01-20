import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
const serverUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
axios.defaults.baseURL = serverUrl;
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
