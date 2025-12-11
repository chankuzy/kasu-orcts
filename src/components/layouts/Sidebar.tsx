// src/components/layouts/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { type UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  role: UserRole;
  userName: string;
}

// Define navigation links for each role
const navConfig = {
  student: [
    { name: 'Dashboard Home', path: '/student/home', icon: '🏠' },
    { name: 'Submit Complaint', path: '/student/submit', icon: '📝' }, // 3.A.
    { name: 'Track & Complaint', path: '/student/track', icon: '📍' }, // 3.B.
    { name: 'Profile Settings', path: '/student/profile', icon: '⚙️' }, // 3.E.
  ],
  lecturer: [
    { name: 'Dashboard Home', path: '/lecturer/home', icon: '🏠' },
    { name: 'Assigned Complaints', path: '/lecturer/complaints', icon: '📬' }, // 4.A.
    { name: 'Result Verification', path: '/lecturer/verify', icon: '✅' }, // 4.B.
    // 4.D. Internal Communication will be part of the complaint detail view
  ],
  admin: [
    { name: 'Dashboard Home', path: '/admin/home', icon: '🏠' },
    { name: 'Complaint Analytics', path: '/admin/analytics', icon: '📊' }, // 5.A.
    { name: 'Manage Complaints', path: '/admin/manage', icon: '📋' }, // 5.B, 5.C.
    { name: 'User Management', path: '/admin/users', icon: '👥' }, // 5.D.
    { name: 'System Settings', path: '/admin/settings', icon: '🛠️' }, // 5.E.
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ role, userName }) => {
  const { logout } = useAuth();
  const navigation = navConfig[role];

  const linkClasses = (isActive: boolean) =>
    `flex items-center px-4 py-2 mt-2 transition duration-200 ease-in-out rounded-lg ${
      isActive
        ? 'bg-blue-700 text-white shadow-md'
        : 'text-gray-300 hover:bg-blue-700 hover:text-white'
    }`;

  return (
    <div className="hidden md:flex flex-col w-64 bg-blue-900 text-white">
      {/* KASU Header */}
      <div className="flex items-center justify-center h-20 shadow-lg border-b border-blue-800">
        <span className="text-2xl font-extrabold tracking-wider">KASU ORCTS</span>
      </div>

      {/* Profile Info (Simplified) */}
      <div className="p-4 border-b border-blue-800 text-center">
        <p className="font-semibold">{userName}</p>
        <p className="text-sm opacity-70 capitalize">({role})</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={(isActive: any) => linkClasses(isActive)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button (8. LOGOUT SYSTEM) */}
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-150 text-white font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;