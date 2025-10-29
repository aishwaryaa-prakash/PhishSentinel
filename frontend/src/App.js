import React from 'react';
import PhishSentinelLanding from './components/PhishSentinelLanding';
import './App.css';
import { Routes, Route } from 'react-router-dom'; // <-- ADDED
import Dashboard from './components/Dashboard'; // <-- ADDED

function App() {
  return (
    <div className="App">
      <Routes> {/* <-- ADDED */}
        {/* Route for your landing page */}
        <Route path="/" element={<PhishSentinelLanding />} /> {/* <-- CHANGED */}
        
        {/* Route for your new dashboard */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* <-- ADDED */}
      </Routes> {/* <-- ADDED */}
    </div>
  );
}

export default App;