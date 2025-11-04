import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function PhishSentinelLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const closeModals = () => {
    setShowSignup(false);
    setShowLogin(false);
    setLoginError('');
    setSignupError('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
  };


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "User Authentication",
      description: "Secure login and registration with Spring Security + JWT",
      icon: "🔐",
      endpoint: "/api/auth"
    },
    {
      title: "Scan History",
      description: "Track all your security scans and analysis results",
      icon: "📊",
      endpoint: "/api/scans"
    },
    {
      title: "Community Reports",
      description: "Report suspicious links and help protect the community",
      icon: "🚨",
      endpoint: "/api/reports"
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive metrics and analytics for administrators",
      icon: "📈",
      endpoint: "/api/admin"
    },
    {
      title: "Emergency Shield Mode",
      description: "Advanced bot detection and flooding user protection",
      icon: "🛡️",
      endpoint: "/api/shield"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      console.log('Sending login request:', { email: formData.email, password: '***' });
      
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      // Check if response has token (backend returns AuthResponse with token and user)
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        setShowLogin(false);
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
        // Use navigate instead of window.location for proper React Router navigation
        window.location.href = "/dashboard";
      } else {
        setLoginError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setLoginError(errorMessage);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setSignupError("Passwords do not match!");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setSignupError("Password must be at least 8 characters long");
      return;
    }

    // Generate username from firstName + lastName (lowercase, no spaces)
    const username = `${formData.firstName}${formData.lastName}`.toLowerCase().replace(/\s+/g, '');
    
    if (!username || username.length < 3) {
      setSignupError("Please enter a valid first and last name");
      return;
    }

    try {
      console.log('Sending registration request:', { username, email: formData.email, password: '***' });
      
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username: username,
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration successful:', response.data);
      alert("Signup successful! Please login now.");
      setShowSignup(false);
      setShowLogin(true);
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      
      let errorMessage = 'Something went wrong during signup';
      
      // Handle network errors (no response)
      if (!error.response) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
        } else {
          errorMessage = `Network error: ${error.message}`;
        }
      }
      // Handle validation errors from backend
      else if (error.response?.data) {
        const data = error.response.data;
        
        // Handle string response
        if (typeof data === 'string') {
          errorMessage = data;
        }
        // Handle object with errors property (from GlobalExceptionHandler)
        else if (data.errors && typeof data.errors === 'object') {
          const errorMessages = Object.values(data.errors);
          errorMessage = errorMessages.length > 0 
            ? errorMessages.join(', ') 
            : (data.message || errorMessage);
        }
        // Handle object with message property
        else if (data.message) {
          errorMessage = data.message;
        }
        // Handle array of errors
        else if (Array.isArray(data)) {
          errorMessage = data.map(e => e.message || e.defaultMessage || e).join(', ');
        }
      }
      
      setSignupError(errorMessage);
    }
  };


  // Close modal when clicking outside
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModals();
    };
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('modal-overlay')) closeModals();
    };

    if (showLogin || showSignup) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [showLogin, showSignup]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        .animate-pulse-soft {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-modal-slide {
          animation: modalSlideIn 0.3s ease-out forwards;
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glass {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
      `}</style>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 modal-overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-slide">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                  <button 
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {loginError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {loginError}
                  </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
                      Forgot password?
                    </a>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Sign In
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setShowLogin(false);
                        setShowSignup(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-50 modal-overlay">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-modal-slide max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                  <button 
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {signupError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {signupError}
                  </div>
                )}
                
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Create a password"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Must be at least 8 characters with numbers and symbols
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-600" 
                      required 
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-800">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-purple-600 hover:text-purple-800">
                        Privacy Policy
                      </a>
                    </span>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Create Account
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Continue with Google</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-white shadow-md'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🛡️
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">PhishSentinel</span>
            </div>
            
            <ul className="hidden lg:flex gap-8 items-center">
              <li><a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">How It Works</a></li>
            </ul>

            <div className="flex gap-3 items-center">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Login
              </button>
              <button 
                onClick={() => setShowSignup(true)}
                className="hidden sm:block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of your existing landing page content remains the same */}
      {/* Hero Section - Centered */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                🚀 AI-Powered Protection
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Protect Everything You Do{' '}
              <span className="gradient-text">Online</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              PhishSentinel uses advanced AI to detect phishing attempts, secure your accounts, and protect your entire digital world in real-time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Watch Demo
              </button>
              <button 
                onClick={() => setShowSignup(true)}
                className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-full font-bold text-lg hover:bg-purple-50 transition-all duration-300"
              >
                Get Started Free
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="text-yellow-400 text-xl">★★★★★</div>
                <span className="text-gray-700 font-medium">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 -right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 -left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Complete Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to stay safe online, powered by cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-8 shadow-lg hover-lift cursor-pointer border border-purple-100"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-mono">
                  {feature.endpoint}
                </div>
              </div>
            ))}
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 shadow-lg hover-lift cursor-pointer text-white flex flex-col justify-center items-center text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3">And More Coming Soon!</h3>
              <p className="text-purple-100 mb-4">We're constantly adding new features to keep you protected</p>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-semibold hover:scale-105 transition-all duration-300">
                Request Feature
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              How PhishSentinel Works
            </h2>
            <p className="text-xl text-gray-600">Simple, fast, and incredibly effective</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">Create your free account and connect your email addresses in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">Our AI continuously monitors and analyzes threats in real-time</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Stay Protected</h3>
              <p className="text-gray-600 leading-relaxed">Get instant alerts and automatic protection from phishing attempts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">5K+</div>
              <div className="text-gray-400">Threats Blocked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-400">Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Secure Your Digital Life?</h2>
          <p className="text-xl text-purple-100 mb-8">Join thousands of users who trust PhishSentinel to keep them safe online</p>
          <button 
            onClick={() => setShowSignup(true)}
            className="px-12 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Get Started - It's Free
          </button>
          <p className="text-purple-200 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white text-xl">
                  🛡️
                </div>
                <span className="text-white font-bold text-lg">PhishSentinel</span>
              </div>
              <p className="text-sm">Protecting your digital world with advanced AI technology.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 PhishSentinel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}