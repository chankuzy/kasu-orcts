// src/components/student/StudentDashboardHome.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

const StudentDashboardHome: React.FC = () => {
    const { currentUser } = useAuth();
    const { complaints } = useComplaints();
    const navigate = useNavigate();

    // Filter complaints specific to the current user
    const studentComplaints = complaints.filter(c => c.studentId === currentUser?.id);
    const totalComplaints = studentComplaints.length;
    const pendingComplaints = studentComplaints.filter(c => c.status === 'Pending' || c.status === 'Under Review' || c.status === 'Sent to Lecturer').length;
    const resolvedComplaints = studentComplaints.filter(c => c.status === 'Resolved').length;

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
                Welcome back, {currentUser?.name}!
            </h1>
            
            {/* Quick Stats (3. STUDENT DASHBOARD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Total Complaints" 
                    count={totalComplaints} 
                    icon="📋" 
                    color="bg-blue-600"
                    onClick={() => navigate('/student/history')}
                />
                <DashboardCard 
                    title="Pending/In Review" 
                    count={pendingComplaints} 
                    icon="⏳" 
                    color="bg-yellow-600"
                    onClick={() => navigate('/student/track')}
                />
                <DashboardCard 
                    title="Resolved Cases" 
                    count={resolvedComplaints} 
                    icon="✅" 
                    color="bg-green-600"
                    onClick={() => navigate('/student/history')}
                />
                <DashboardCard 
                    title="Submit New" 
                    count={0} 
                    icon="🆕" 
                    color="bg-purple-600"
                    onClick={() => navigate('/student/submit')}
                />
            </div>
            
            {/* Quick Access Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                        onClick={() => navigate('/student/submit')}
                        className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition"
                    >
                        <span className="text-3xl">📝</span>
                        <span className="mt-2 font-medium text-blue-900">Submit New Complaint</span>
                        <span className="text-sm text-gray-500">Report a result issue.</span>
                    </button>
                    <button 
                        onClick={() => navigate('/student/track')}
                        className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition"
                    >
                        <span className="text-3xl">📍</span>
                        <span className="mt-2 font-medium text-green-900">Track Status</span>
                        <span className="text-sm text-gray-500">See real-time progress.</span>
                    </button>
                    <button 
                        onClick={() => navigate('/student/profile')}
                        className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                    >
                        <span className="text-3xl">⚙️</span>
                        <span className="mt-2 font-medium text-gray-900">Update Profile</span>
                        <span className="text-sm text-gray-500">Manage account details.</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;