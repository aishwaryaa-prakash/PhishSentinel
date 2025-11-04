import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userStr) {
      // If no token or user, redirect to login
      navigate('/');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // TODO: Implement URL scanning
    console.log('Scanning URL:', url);
    alert('URL scanning feature will be implemented here!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Get user's first name or username for display
  const displayName = user.username || user.email?.split('@')[0] || 'User';
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-xl">
                🛡️
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                PhishSentinel
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{firstName}</div>
                <div className="text-sm text-gray-500">Premium Plan</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-semibold">
                {firstName.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Protect yourself from phishing attacks with real-time URL analysis.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Total Scans</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-3xl font-bold text-green-600 mb-1">2</div>
            <div className="text-sm text-gray-600">Safe URLs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-3xl font-bold text-red-600 mb-1">1</div>
            <div className="text-sm text-gray-600">Threats Detected</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">99.9%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* URL Scanner - Left Side */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex border-b border-gray-200 mb-6">
              <button className="px-4 py-2 text-sm font-semibold text-purple-600 border-b-2 border-purple-600">
                URL Scanner
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Bulk Scan
              </button>
            </div>
            
            <form onSubmit={handleScan}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter URL to Scan
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Scan URL for Threats
              </button>
            </form>
          </div>

          {/* Quick Actions - Right Side */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Email Protection</div>
                    <div className="text-sm text-gray-500">Scan email links</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    🖥️
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Browser Extension</div>
                    <div className="text-sm text-gray-500">Install protection</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    👥
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Community Reports</div>
                    <div className="text-sm text-gray-500">View recent threats</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Scans Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                  View All
                </a>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">https://example.com</div>
                      <div className="text-xs text-gray-500">17/10/2025</div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
