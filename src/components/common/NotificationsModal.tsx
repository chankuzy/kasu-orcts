// src/components/common/NotificationsModal.tsx

import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 flex justify-end p-4 sm:p-6"
      onClick={onClose} // Close modal when clicking outside
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md h-fit max-h-[80vh] overflow-y-auto transform transition-all duration-300 translate-y-0"
        onClick={(e) => e.stopPropagation()} // Prevent modal closure when clicking inside
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Notifications 🔔
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-4 text-center">
          <div className="text-4xl mb-4 text-indigo-500">
            🎉
          </div>
          <p className="text-lg font-medium text-gray-700">
            No new notifications yet!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            We'll alert you here when a Lecturer or Admin responds to your complaint.
          </p>
        </div>

        {/* Placeholder for future notifications */}
        {/* <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          <div className="p-4 hover:bg-gray-50 cursor-pointer">
            <p className="text-sm font-medium text-gray-900">Complaint #123 Resolved!</p>
            <p className="text-xs text-gray-500">Your grade for CSC101 has been updated. (3 hours ago)</p>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default NotificationsModal;