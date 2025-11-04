import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    // State to match your form's fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Generate username from firstName + lastName (lowercase, no spaces)
        const username = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, '');
        
        if (!username || username.length < 3) {
            setError('Please enter a valid first and last name');
            return;
        }

        try {
            console.log('Sending registration request:', { username, email, password: '***' });
            
            // ✅ SEND the username field along with email and password
            const response = await axios.post('http://localhost:8080/api/auth/register', { 
                username: username, 
                email: email, 
                password: password 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Registration successful:', response.data);
            // Redirect to login page on successful registration
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            
            let errorMessage = 'Something went wrong during signup';
            
            // Handle network errors (no response)
            if (!err.response) {
                if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
                    errorMessage = 'Cannot connect to server. Please make sure the backend is running.';
                } else {
                    errorMessage = `Network error: ${err.message}`;
                }
            }
            // Handle validation errors from backend
            else if (err.response?.data) {
                const data = err.response.data;
                
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
            
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Create Account</h2>
                {error && <p className="bg-red-500 text-white p-3 rounded mb-4 text-center">{error}</p>}
                
                {/* Form fields from your screenshot */}
                <div className="mb-4">
                    <label className="block text-gray-400 mb-2" htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400 mb-2" htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with numbers and symbols</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                </div>

                <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold p-3 rounded transition duration-300">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;