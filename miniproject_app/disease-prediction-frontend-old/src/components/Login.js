import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error state
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Get JWT tokens (use email instead of username)
      const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/create/', {
        email, // Django backend expects email field if LOGIN_FIELD = 'email'
        password
      });

      const { access, refresh } = response.data;

      // 3. Get user info (fetch role)
      const userRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });

      const user = userRes.data;

      // 4. Save tokens and role in localStorage together
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_role', user.role);

      // 5. Redirect based on role ✅
      if (user.role === 'patient') {
        navigate('/predict');
      } else if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Unknown role. Contact support.');
      }

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#cccfff] to-[#42006c]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition duration-300"
        >
          Login
        </button>

        {/* Optional link to register */}
        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-purple-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
