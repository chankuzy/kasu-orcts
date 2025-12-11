import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { type Student } from '../../types';

const KASU_DEPARTMENTS = ['Computer Science', 'Cyber Security', 'Mathematics', 'Engineering', 'Architecture', 'Law', 'Medicine'];
const ACADEMIC_LEVELS = ['100', '200', '300', '400', '500', '600'];

const SignUp: React.FC = () => {
  // FIX: Omit 'isActive' from the state type as it is a system default, not user input.
  const [formData, setFormData] = useState<Omit<Student, 'role' | 'password' | 'isActive'> & { password: string }>({
    id: '',
    password: '',
    name: '',
    department: KASU_DEPARTMENTS[0],
    level: ACADEMIC_LEVELS[0],
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.id || !formData.password || !formData.name) {
        setError('Please fill in all required fields.');
        return;
    }

    // Call the registration function from AuthContext
    // The formData object now correctly matches the expected parameter type.
    const result = registerStudent(formData);

    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      // Clear form data on success
      setFormData({
        id: '',
        password: '',
        name: '',
        department: KASU_DEPARTMENTS[0],
        level: ACADEMIC_LEVELS[0],
        email: '',
        phoneNumber: '',
      });
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message || 'Registration failed. Please try a different Matric Number.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">
            Student Registration
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Create an account using your KASU Matric Number.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-md">
              {success}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Aisha Musa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Matric Number */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">Matric Number (Unique ID)</label>
              <input
                id="id"
                name="id"
                type="text"
                required
                value={formData.id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="KASU/20/CS/1234"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              >
                {KASU_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
              <select
                id="level"
                name="level"
                required
                value={formData.level}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              >
                {ACADEMIC_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="aisha.musa@kasu.edu.ng"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="080XXXXXXXXX"
                />
              </div>
          </div>


          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 transition duration-150"
            >
              Register Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
                Already have an account? 
                <a href="/login" className="font-medium text-blue-900 hover:text-blue-700 ml-1">
                    Sign in here
                </a>
            </p>
        </div>
      </div>
      </div>
  );
};

export default SignUp;