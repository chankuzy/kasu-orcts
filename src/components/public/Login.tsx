// src/components/public/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = login(id, password);

    if (result.success && result.role) {
      navigate(`/${result.role}/home`, { replace: true });
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          {/* KASU Logo Placeholder */}
          <div className="w-16 h-16 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl font-bold">K</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Sign in to KASU ORCTS
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Online Result Complaint & Tracking System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Matric / Staff ID
            </label>
            <input
              id="id"
              name="id"
              type="text"
              autoComplete="username"
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              placeholder="e.g., KASU/19/CS/1001 or KASU/ADMIN/001"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition duration-150"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Are you a new student? 
                <a href="/register" className="font-medium text-blue-900 hover:text-blue-700 ml-1">
                    Register here
                </a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;