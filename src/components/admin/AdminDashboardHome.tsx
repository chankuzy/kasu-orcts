// src/components/admin/AdminDashboardHome.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardHome: React.FC = () => {
    const { currentUser, appUsers } = useAuth();
    const { complaints } = useComplaints();
    const navigate = useNavigate();

    // Stats
    const totalComplaints = complaints.length;
    const totalStudents = appUsers.filter(u => u.role === 'student').length;
    const verificationQueue = complaints.filter(c => c.status === 'Admin Verification').length;
    const pendingAssignment = complaints.filter(c => c.status === 'Pending' && c.assignedToId === null).length;


    const DashboardCard: React.FC<{ title: string, count: number, icon: string, color: string, onClick?: () => void }> = ({ title, count, icon, color, onClick }) => (
        <div 
            className={`p-6 rounded-xl shadow-md ${color} text-white cursor-pointer hover:shadow-xl transition duration-300`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <span className="text-4xl">{icon}</span>
                <div className="text-right">
                    <p className="text-4xl font-extrabold">{count}</p>
                    <p className="text-sm opacity-90">{title}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome, {currentUser?.name}! (System Administrator)
            </h1>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Verification Queue" 
                    count={verificationQueue} 
                    icon="⏳" 
                    color="bg-purple-600"
                    onClick={() => navigate('/admin/manage')}
                />
                <DashboardCard 
                    title="Unassigned Complaints" 
                    count={pendingAssignment} 
                    icon="📥" 
                    color="bg-red-600"
                    onClick={() => navigate('/admin/manage')}
                />
                <DashboardCard 
                    title="Total Complaints" 
                    count={totalComplaints} 
                    icon="📋" 
                    color="bg-blue-600"
                    onClick={() => navigate('/admin/analytics')}
                />
                <DashboardCard 
                    title="Registered Students" 
                    count={totalStudents} 
                    icon="👨‍🎓" 
                    color="bg-green-600"
                    onClick={() => navigate('/admin/users')}
                />
            </div>
            
            {/* Management Quick Links */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Core Management Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => navigate('/admin/manage')}
                        className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                    >
                        <span className="text-3xl">🗂️</span>
                        <span className="mt-2 font-medium text-indigo-900">Manage & Assign Cases</span>
                        <span className="text-sm text-gray-500">Handle assignments and final closures.</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/users')}
                        className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition"
                    >
                        <span className="text-3xl">👥</span>
                        <span className="mt-2 font-medium text-yellow-900">User Management</span>
                        <span className="text-sm text-gray-500">Create, reset, or deactivate accounts.</span>
                    </button>
                    <button 
                        onClick={() => navigate('/admin/settings')}
                        className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                    >
                        <span className="text-3xl">🛠️</span>
                        <span className="mt-2 font-medium text-gray-900">System Settings</span>
                        <span className="text-sm text-gray-500">Configure courses, departments, etc.</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;