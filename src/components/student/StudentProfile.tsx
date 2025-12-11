import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { Student } from '../../types';

const StudentProfile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  
  // We must ensure currentUser is treated as Student for state initialization
  const student = currentUser as Student; 

  const [formData, setFormData] = useState<Partial<Student>>({
    name: student?.name || '',
    email: student?.email || '',
    phoneNumber: student?.phoneNumber || '',
    password: student?.password || '', // Use current password for pre-filling
    department: student?.department || '',
    level: student?.level || '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Only allow students to access this page (although routing protects it)
    if (student?.role !== 'student') {
        setMessage({ type: 'error', text: 'Access denied.' });
        return;
    }

    const result = updateProfile(formData);

    if (result.success) {
      setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' });
      // Important: Password field is NOT reset unless the user wants to keep the old one.
    } else {
      setMessage({ type: 'error', text: result.message || 'Failed to update profile.' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Profile Management</h2>
      <p className="text-gray-600 mb-6">
        Matric Number: **{student?.id}** | Department: **{student?.department}** | Level: **{student?.level}**
      </p>

      {message && (
        <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (3.E)</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Phone Number & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (3.E)</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (Update)</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="Enter new password to change"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        
        {/* Note on fixed fields */}
        <p className="text-sm text-gray-500 pt-4 border-t">
          **Note:** Department, Level, and Matric Number cannot be changed here. Contact the Admin for system-level corrections.
        </p>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;