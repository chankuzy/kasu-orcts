// src/components/admin/AdminSystemSettings.tsx
import React from 'react';

const AdminSystemSettings: React.FC = () => {

    const systemSettings = [
        { name: "Academic Session", value: "2023/2024", description: "Current academic year for result processing.", editable: true },
        { name: "Max Pending Cases (Lecturer)", value: 20, description: "Maximum complaints assignable to a lecturer at once.", editable: true },
        { name: "System Email", value: "admin@university.edu", description: "Primary contact email for automated alerts.", editable: true },
        { name: "Total Departments", value: 12, description: "Number of active departments in the database.", editable: false },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">System Configuration & Settings 🛠️</h2>
            
            <p className="text-gray-600">
                Manage global settings, system constants, and reference data (e.g., courses, departments, academic calendar).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Global Configuration Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Global Parameters</h3>
                    <ul className="space-y-4">
                        {systemSettings.map((setting) => (
                            <li key={setting.name} className="border-b pb-2">
                                <p className="font-semibold text-gray-700">{setting.name}: <span className="font-mono text-indigo-600">{setting.value}</span></p>
                                <p className="text-sm text-gray-500">{setting.description}</p>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Update Global Settings (Simulated)
                    </button>
                </div>

                {/* Reference Data Management Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Reference Data Management</h3>
                    
                    <div className="space-y-3">
                        <p className="text-sm text-gray-600">The core functionality below requires a persistent backend/database. This section simulates the interface.</p>
                        
                        <div className="p-3 bg-gray-50 border rounded-md">
                            <p className="font-medium">📚 Manage Courses and Departments</p>
                            <p className="text-xs text-gray-500">Add, edit, or deactivate courses and departments that appear in complaint forms.</p>
                            <button className="mt-2 text-sm text-green-600 hover:underline">Go to Course Editor (Placeholder)</button>
                        </div>
                        
                        <div className="p-3 bg-gray-50 border rounded-md">
                            <p className="font-medium">🗓️ Academic Calendar Setup</p>
                            <p className="text-xs text-gray-500">Define registration deadlines and session start/end dates.</p>
                            <button className="mt-2 text-sm text-green-600 hover:underline">Go to Calendar Setup (Placeholder)</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-700">System Status</h3>
                <p className="text-sm text-green-600">All services operational. Database connection (localStorage) stable.</p>
            </div>
        </div>
    );
};

export default AdminSystemSettings;