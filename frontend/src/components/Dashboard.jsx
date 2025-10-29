import React, { useState, useEffect } from 'react';
import { Link, useNavigate }  from 'react-router-dom'; // Import Link and useNavigate

export default function Dashboard() { // Renamed to Dashboard
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('scan');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Premium'
  });

  // Mock scan history data
  useEffect(() => {
    const mockHistory = [
      {
        id: 1,
        url: 'https://example.com',
        status: 'safe',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        threatLevel: 'None',
        details: 'Legitimate website with valid SSL certificate'
      },
      {
        id: 2,
        url: 'https://suspicious-site.com',
        status: 'unsafe',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        threatLevel: 'High',
        details: 'Phishing attempt detected - fake login page'
      },
      {
        id: 3,
        url: 'https://another-safe-site.org',
        status: 'safe',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        threatLevel: 'None',
        details: 'Trusted organization website'
      }
    ];
    setScanHistory(mockHistory);
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isSafe = Math.random() > 0.3; // 70% chance of being safe for demo
      const result = {
        url,
        status: isSafe ? 'safe' : 'unsafe',
        threatLevel: isSafe ? 'None' : 'High',
        confidence: isSafe ? 98 : 92,
        details: isSafe 
          ? 'This website appears to be legitimate and safe to use.'
          : 'Warning: Potential phishing website detected. Avoid entering personal information.',
        threats: isSafe ? [] : ['Phishing attempt', 'Suspicious redirects', 'Fake login form'],
        timestamp: new Date().toISOString()
      };
      
      setScanResult(result);
      
      // Add to history
      setScanHistory(prev => [{
        id: prev.length + 1,
        ...result
      }, ...prev]);
      
      setIsLoading(false);
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'unsafe': return 'text-red-600 bg-red-100';
      case 'suspicious': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'None': return 'text-green-600';
      case 'Low': return 'text-yellow-600';
      case 'Medium': return 'text-orange-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-lg">
                🛡️
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                PhishSentinel
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.plan} Plan</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            Protect yourself from phishing attacks with real-time URL analysis
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600 mb-2">{scanHistory.length}</div>
            <div className="text-gray-600">Total Scans</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {scanHistory.filter(scan => scan.status === 'safe').length}
            </div>
            <div className="text-gray-600">Safe URLs</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {scanHistory.filter(scan => scan.status === 'unsafe').length}
            </div>
            <div className="text-gray-600">Threats Detected</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Accuracy Rate</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Scanner */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex border-b mb-6">
                <button
                  onClick={() => setActiveTab('scan')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'scan'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  URL Scanner
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                    activeTab === 'bulk'
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Bulk Scan
                </button>
              </div>

              {activeTab === 'scan' && (
                <div className="space-y-6">
                  <form onSubmit={handleScan} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter URL to Scan
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Scanning URL...
                        </div>
                      ) : (
                        'Scan URL for Threats'
                      )}
                    </button>
                  </form>

                  {scanResult && (
                    <div className="animate-slide-in">
                      <div className={`p-6 rounded-lg border-2 ${
                        scanResult.status === 'safe' 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            scanResult.status === 'safe' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {scanResult.status === 'safe' ? (
                              <span className="text-2xl">✅</span>
                            ) : (
                              <span className="text-2xl">⚠️</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {scanResult.status === 'safe' ? 'Safe Website' : 'Unsafe Website'}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(scanResult.status)}`}>
                                {scanResult.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-600">{scanResult.url}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Threat Level</div>
                            <div className={`font-semibold ${getThreatLevelColor(scanResult.threatLevel)}`}>
                              {scanResult.threatLevel}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Confidence</div>
                            <div className="font-semibold text-gray-900">
                              {scanResult.confidence}%
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm text-gray-500 mb-2">Analysis Details</div>
                          <p className="text-gray-700">{scanResult.details}</p>
                        </div>

                        {scanResult.threats && scanResult.threats.length > 0 && (
                          <div>
                            <div className="text-sm text-gray-500 mb-2">Detected Threats</div>
                            <div className="space-y-1">
                              {scanResult.threats.map((threat, index) => (
                                <div key={index} className="flex items-center gap-2 text-red-700">
                                  <span>•</span>
                                  <span>{threat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-500">
                            Scanned on {new Date(scanResult.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bulk' && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Bulk URL Scanning
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload a file with multiple URLs to scan them all at once
                  </p>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                    Upload CSV File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - History & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="font-semibold text-gray-900">Email Protection</div>
                    <div className="text-sm text-gray-600">Scan email links</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold text-gray-900">Browser Extension</div>
                    <div className="text-sm text-gray-600">Install protection</div>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold text-gray-900">Community Reports</div>
                    <div className="text-sm text-gray-600">View recent threats</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-2xl shadow-lg border p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-semibold">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {scanHistory.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${
                          scan.status === 'safe' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {scan.url}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(scan.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">💡 Security Tip</h3>
              <p className="text-purple-100 text-sm">
                Always check URLs before clicking. Look for HTTPS, verify domain names, 
                and be cautious of shortened links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
