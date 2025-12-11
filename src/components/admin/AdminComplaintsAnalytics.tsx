import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import type { Complaint } from '../../types';

const StatCard: React.FC<{ title: string, value: string | number, color: string }> = ({ title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-b-4 ${color}`}>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
);

const getTopCourses = (complaints: Complaint[]) => {
    const courseCounts = complaints.reduce((acc, complaint) => {
        const key = `${complaint.courseCode} - ${complaint.courseTitle || complaint.type}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(courseCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5);
};

const AdminComplaintAnalytics: React.FC = () => {
    const { complaints } = useComplaints();
    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
    const pendingComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'Sent to Lecturer' || c.status === 'Under Review' || c.status === 'Awaiting Student Response').length;
    const rejectionRate = totalComplaints > 0 ? ((complaints.filter(c => c.status === 'Rejected').length / totalComplaints) * 100).toFixed(1) : 0;
    const verificationNeeded = complaints.filter(c => c.status === 'Admin Verification').length;
    const topCourses = getTopCourses(complaints);
    const mockAvgResponseTime = "2.3 days"; 

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">System-Wide Complaint Analytics</h2>
            <p className="text-gray-600">Overview of the entire system performance.</p>
                [Image of a clean dashboard with charts and analytics cards]
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Complaints" value={totalComplaints} color="border-blue-500" />
                <StatCard title="Resolved Complaints" value={resolvedComplaints} color="border-green-500" />
                <StatCard title="Active/Pending" value={pendingComplaints} color="border-yellow-500" />
                <StatCard title="Admin Verification Queue" value={verificationNeeded} color="border-purple-500" />
                <StatCard title="Rejection Rate" value={`${rejectionRate}%`} color="border-red-500" />
                <StatCard title="Average Response Time" value={mockAvgResponseTime} color="border-indigo-500" />
            </div>

            <hr className="my-8" />

            {/* Charts and Graphs Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Top Courses with Issues (5.A) */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Problematic Courses</h3>
                    <ul className="space-y-2">
                        {topCourses.map(([course, count], index) => (
                            <li key={course} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <span className="text-sm font-medium text-gray-700">{index + 1}. {course}</span>
                                <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">{count} Issues</span>
                            </li>
                        ))}
                    </ul>
                    {topCourses.length === 0 && <p className="text-gray-500">No complaints recorded yet.</p>}
                </div>

                {/* Status Distribution (Mock Pie Chart) (5.A) */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Complaint Status Distribution (Mock Chart)</h3>
                    {/* Simplified simulation of a pie chart using flex */}
                    <div className="flex justify-center items-center h-40 bg-gray-200 rounded-lg">
                        <p className="text-gray-600 font-medium">Visualization Placeholder</p>
                    </div>
                    <div className="mt-4 flex flex-wrap justify-around text-xs">
                        <span className="text-blue-600">Total ({totalComplaints})</span>
                        <span className="text-green-600">Resolved ({resolvedComplaints})</span>
                        <span className="text-yellow-600">Pending ({pendingComplaints})</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminComplaintAnalytics;