import React from "react";
import { Routes, Route } from "react-router-dom";
import PhishSentinelLanding from "./components/PhishSentinelLanding";
import Dashboard from "./components/Dashboard";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 🌐 Landing Page */}
        <Route path="/" element={<PhishSentinelLanding />} />

        {/* 🧭 Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 👤 Authentication Pages */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
