// src/components/layouts/DashboardLayout.tsx

import React, { type ReactNode, useState } from 'react'; // 1. Import useState
import Sidebar from './Sidebar';
import type { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import NotificationsModal from '../common/NotificationsModal'; // 2. Import the Notifications Modal

interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, children }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name || "User";
  
  // 3. State to control the visibility of the Notifications Modal
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); 

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 1. Sidebar (Fixed on the left) */}
      {/* NOTE: Ensure your Sidebar component receives and handles the necessary props */}
      <Sidebar role={role} userName={userName} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header/Top Bar */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {role} Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            {/* 4. Notification Icon with Click Handler */}
            <button 
              onClick={() => setIsNotificationsOpen(true)} // Open the modal on click
              className="text-gray-500 hover:text-blue-900 transition relative"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {/* Simple Mock Notification Badge */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>
            <span className="text-gray-700">Welcome, **{userName}**!</span>
          </div>
        </header>

        {/* Page Content (Scrolling Area) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
      
      {/* 5. Render the Notifications Modal component */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)} // Function to close the modal
      />

    </div>
  );
};

export default DashboardLayout;