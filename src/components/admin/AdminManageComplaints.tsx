// src/components/admin/AdminManageComplaints.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import type { Complaint, User, ComplaintStatus, Lecturer } from '../../types';

// Utility to find all lecturers for assignment dropdown
const getLecturers = (users: User[]): Lecturer[] => {
    return users.filter(user => user.role === 'lecturer') as Lecturer[];
};

// Reusable Status Badge
const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  switch (status) {
    case 'Resolved': colorClass = 'bg-green-100 text-green-800'; break;
    case 'Pending': colorClass = 'bg-red-100 text-red-800'; break;
    case 'Sent to Lecturer': 
    case 'Under Review': colorClass = 'bg-blue-100 text-blue-800'; break;
    case 'Admin Verification': colorClass = 'bg-purple-100 text-purple-800 animate-pulse'; break;
    case 'Awaiting Student Response': colorClass = 'bg-yellow-100 text-yellow-800'; break; // Added to prevent default fallback
    case 'Rejected': colorClass = 'bg-pink-100 text-pink-800'; break; // Added to prevent default fallback
    default: colorClass = 'bg-yellow-100 text-yellow-800'; // Other statuses
  }
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

const AdminManageComplaints: React.FC = () => {
    const { appUsers, currentUser } = useAuth(); // Destructure currentUser for the fix
    const { complaints, assignComplaint, resolveComplaint } = useComplaints();
    const lecturers = getLecturers(appUsers);
    
    // State for filtering/tabs
    const [filter, setFilter] = useState<'pending' | 'verification' | 'all'>('pending');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [assignmentId, setAssignmentId] = useState('');
    const [resolutionComment, setResolutionComment] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Filtered Complaints based on the current tab
    const filteredComplaints = complaints.slice().sort((a, b) => b.id - a.id).filter(c => {
        if (filter === 'pending') {
            return c.status === 'Pending' && c.assignedToId === null;
        }
        if (filter === 'verification') {
            return c.status === 'Admin Verification';
        }
        // 'all' includes all open, non-resolved/non-rejected cases
        return c.status !== 'Resolved' && c.status !== 'Rejected';
    });

    useEffect(() => {
        if (selectedComplaint && selectedComplaint.status === 'Admin Verification') {
            setResolutionComment(selectedComplaint.feedback || ''); // Pre-fill with Lecturer's feedback
        } else {
            setResolutionComment('');
        }
    }, [selectedComplaint]);

    // 5.B. Handle Complaint Assignment
    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!selectedComplaint || !assignmentId) {
            setMessage({ type: 'error', text: 'Please select a complaint and a lecturer.' });
            return;
        }

        assignComplaint(selectedComplaint.id, assignmentId);
        
        setMessage({ type: 'success', text: `Complaint #${selectedComplaint.id} successfully assigned to Lecturer ID: ${assignmentId}.` });
        setSelectedComplaint(null);
        setAssignmentId('');
        setFilter('all'); // Move to the 'All' tab to see the updated status
    };

    // 5.C. Handle Final Verification and Resolution
    const handleResolve = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!selectedComplaint || !resolutionComment.trim()) {
            setMessage({ type: 'error', text: 'Please provide a final resolution message.' });
            return;
        }

        if (selectedComplaint.status !== 'Admin Verification') {
            setMessage({ type: 'error', text: 'Only complaints in "Admin Verification" can be resolved.' });
            return;
        }

        if (!currentUser) {
            setMessage({ type: 'error', text: 'Authentication error. Admin user not found.' });
            return;
        }

        // FIX: Passing the third argument (resolvedBy: string) - the Admin's name/ID
        resolveComplaint(
            selectedComplaint.id, 
            resolutionComment, 
            currentUser.name || `Admin ${currentUser.id}`
        );
        
        setMessage({ type: 'success', text: `Complaint #${selectedComplaint.id} successfully Verified and Closed (Resolved).` });
        setSelectedComplaint(null);
        setResolutionComment('');
    };

    const getLecturerName = (id: string | null) => {
        const lecturer = lecturers.find(l => l.id === id);
        return lecturer ? lecturer.name : 'N/A';
    };


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Complaint Assignment and Verification</h2>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Tabbed Navigation */}
            <div className="flex space-x-2 border-b border-gray-200">
                <button 
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition duration-150 ${filter === 'pending' ? 'bg-red-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    📥 Unassigned Cases
                </button>
                <button 
                    onClick={() => setFilter('verification')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition duration-150 ${filter === 'verification' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    ✅ Verification Queue
                </button>
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition duration-150 ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                    📋 All Active Cases
                </button>
            </div>

            {/* Complaints Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course / Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Lecturer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((complaint) => (
                                <tr key={complaint.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{complaint.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        **{complaint.courseCode}** by {complaint.studentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={complaint.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getLecturerName(complaint.assignedToId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => setSelectedComplaint(complaint)}
                                            className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                                        >
                                            {complaint.status === 'Pending' ? 'Assign' : 'Review'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No cases matching the current filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Complaint Detail / Action Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-xl w-full mx-4 my-8">
                        <button 
                            onClick={() => setSelectedComplaint(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl leading-none"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2">
                            Complaint #{selectedComplaint.id}: **{selectedComplaint.courseCode}**
                        </h3>
                        
                        {/* Display basic info */}
                        <div className="text-sm space-y-2 mb-6">
                            <p><strong>Student ID:</strong> {selectedComplaint.studentId}</p>
                            <p><strong>Issue:</strong> {selectedComplaint.type}</p>
                            <p><strong>Status:</strong> <StatusBadge status={selectedComplaint.status} /></p>
                            <p><strong>Description:</strong> <span className="p-1 bg-gray-50 rounded">{selectedComplaint.description.substring(0, 100)}...</span></p>
                            {selectedComplaint.assignedToId && <p><strong>Assigned To:</strong> {getLecturerName(selectedComplaint.assignedToId)}</p>}
                            {selectedComplaint.feedback && <p><strong>Lecturer Feedback:</strong> <span className="text-blue-700">{selectedComplaint.feedback}</span></p>}
                        </div>

                        {/* Assignment Form (5.B) */}
                        {selectedComplaint.status === 'Pending' && (
                            <form onSubmit={handleAssign} className="p-4 bg-red-50 border border-red-300 rounded-lg space-y-3">
                                <h4 className="font-bold text-red-800">Assign Complaint</h4>
                                <select
                                    required
                                    value={assignmentId}
                                    onChange={(e) => setAssignmentId(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="">-- Select Lecturer for Assignment --</option>
                                    {lecturers.map(lecturer => (
                                        <option key={lecturer.id} value={lecturer.id}>{lecturer.name} ({lecturer.id})</option>
                                    ))}
                                </select>
                                <button type="submit" className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
                                    Assign Case to Lecturer
                                </button>
                            </form>
                        )}

                        {/* Final Resolution Form (5.C) */}
                        {selectedComplaint.status === 'Admin Verification' && (
                            <form onSubmit={handleResolve} className="p-4 bg-purple-50 border border-purple-300 rounded-lg space-y-3">
                                <h4 className="font-bold text-purple-800">Final Verification & Resolution</h4>
                                <p className="text-sm">Lecturer's Recommendation: <span className="font-semibold text-purple-700">{selectedComplaint.feedback || 'N/A'}</span></p>
                                <textarea
                                    rows={3}
                                    required
                                    value={resolutionComment}
                                    onChange={(e) => setResolutionComment(e.target.value)}
                                    placeholder="Enter final verification comments and action taken (e.g., Result updated in portal)."
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">
                                    Verify and Resolve (Close Case)
                                </button>
                            </form>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button 
                                onClick={() => setSelectedComplaint(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManageComplaints;