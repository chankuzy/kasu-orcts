// src/components/lecturer/LecturerDashboardHome.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const LecturerDashboardHome: React.FC = () => {
    const { currentUser } = useAuth();
    const { complaints } = useComplaints();
    const navigate = useNavigate();

    // Filter complaints specific to the current lecturer's ID
    const lecturerComplaints = complaints.filter(c => c.assignedToId === currentUser?.id);
    const activeComplaints = lecturerComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected' && c.status !== 'Admin Verification');
    const awaitingResponse = lecturerComplaints.filter(c => c.status === 'Awaiting Student Response').length;
    const forAdminVerification = lecturerComplaints.filter(c => c.status === 'Admin Verification').length;


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
                Welcome, {currentUser?.name}!
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Active Complaints" 
                    count={activeComplaints.length} 
                    icon="📬" 
                    color="bg-indigo-600"
                    onClick={() => navigate('/lecturer/complaints')}
                />
                <DashboardCard 
                    title="Awaiting Student Info" 
                    count={awaitingResponse} 
                    icon="⚠️" 
                    color="bg-red-600"
                    onClick={() => navigate('/lecturer/complaints')}
                />
                <DashboardCard 
                    title="Awaiting Admin Verification" 
                    count={forAdminVerification} 
                    icon="⏳" 
                    color="bg-purple-600"
                />
                <DashboardCard 
                    title="Total Processed" 
                    count={lecturerComplaints.length - activeComplaints.length} 
                    icon="✅" 
                    color="bg-gray-600"
                />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => navigate('/lecturer/complaints')}
                        className="flex flex-col items-center p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                    >
                        <span className="text-3xl">📧</span>
                        <span className="mt-2 font-medium text-indigo-900">Review Assigned Complaints</span>
                        <span className="text-sm text-gray-500">View and respond to pending result issues.</span>
                    </button>
                     <button 
                        // Placeholder for 4.D. Internal Communication (handled via comment section)
                        onClick={() => alert("Internal Communication features like direct messaging are integrated into the response form comments.")}
                        className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition"
                    >
                        <span className="text-3xl">💬</span>
                        <span className="mt-2 font-medium text-yellow-900">Review Communication</span>
                        <span className="text-sm text-gray-500">Check notes and history (viewed in complaint details).</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LecturerDashboardHome;