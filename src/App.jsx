import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ExpenseHistory from "./pages/ExpenseHistory";
import Register from "./pages/Register"; // Import the new page
import axios from "axios";
import "./App.css";

// --- AUTH COMPONENT (Login/Register Switcher) ---
const AuthScreen = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  if (isRegistering) {
    return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Expense Tracker Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Access Dashboard</button>

        <p style={{ marginTop: "15px", color: "#888", fontSize: "0.9rem" }}>
          New here?{" "}
          <span
            onClick={() => setIsRegistering(true)}
            style={{ color: "#6366f1", cursor: "pointer", fontWeight: "bold" }}
          >
            Create Account
          </span>
        </p>
      </form>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // If no token, show Auth Screen (Login or Register)
  if (!token) {
    return <AuthScreen setToken={setToken} />;
  }

  return (
    <Router>
      <div className="dashboard-container">
        <nav className="sidebar">
          <div className="brand">Expense Tracker</div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            History
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            Settings
          </NavLink>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<ExpenseHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
