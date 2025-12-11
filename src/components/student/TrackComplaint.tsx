// src/components/student/TrackComplaint.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import type { Complaint, ComplaintHistoryEntry, ComplaintStatus } from '../../types';

// Helper component for the status badge (3.B)
const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  switch (status) {
    case 'Resolved':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Pending':
    case 'Received':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Under Review':
    case 'Sent to Lecturer':
    case 'Admin Verification':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Awaiting Student Response':
      colorClass = 'bg-red-100 text-red-800 animate-pulse'; 
      break;
    case 'Rejected':
      colorClass = 'bg-pink-100 text-pink-800';
      break;
  }
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

// Helper component for the History Timeline (3.C)
const HistoryTimeline: React.FC<{ history: ComplaintHistoryEntry[] }> = ({ history }) => (
    <ol className="relative border-l border-gray-200 ml-3 mt-4">
      {/* Reverse history to show the latest action first */}
      {history.slice().reverse().map((entry, index) => ( 
        <li key={index} className="mb-4 ml-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
          <time className="mb-1 text-xs font-normal leading-none text-gray-400">{new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString()}</time>
          <h3 className="text-sm font-semibold text-gray-900">{entry.action}</h3>
          {entry.by && <p className="text-xs text-gray-500">By: {entry.by}</p>}
        </li>
      ))}
    </ol>
);

const TrackComplaint: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, updateComplaintStatus } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [reopenMessage, setReopenMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Sync selected complaint with global state changes
  useEffect(() => {
    if (selectedComplaint) {
        const latestComplaint = complaints.find(c => c.id === selectedComplaint.id);
        if (latestComplaint) {
            setSelectedComplaint(latestComplaint);
        }
    }
  }, [complaints]);

  // Filter complaints by the current student's ID
  const studentComplaints = complaints.filter(c => c.studentId === currentUser?.id);

  // Student provides requested info. Status reverts to 'Under Review'.
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');

    if (!selectedComplaint || !currentUser) {
        setUpdateError('Error: Invalid complaint or user context.');
        return;
    }

    if (!reopenMessage.trim()) {
        setUpdateError('Please provide a message to update the complaint.');
        return;
    }

    if (selectedComplaint.status !== 'Awaiting Student Response') {
        setUpdateError('This complaint is not currently awaiting your response.');
        return;
    }

    const newStatus: ComplaintStatus = 'Under Review'; 
    const message = `Student provided requested information: "${reopenMessage.substring(0, 70)}..."`;
    
    updateComplaintStatus(selectedComplaint.id, newStatus, message, currentUser.id);
    
    setUpdateSuccess('Your response has been submitted. The complaint is now under review.');
    setReopenMessage('');
  };
  
  if (!currentUser) {
    return <div className="p-6 text-center text-red-600">Please log in to track your complaints.</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 mb-6">Complaint Tracking & History</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentComplaints.length > 0 ? (
              studentComplaints
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((complaint) => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="font-mono">#{complaint.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    **{complaint.courseCode}** - {complaint.courseTitle || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.dateSubmitted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        const latestComplaint = complaints.find(c => c.id === complaint.id);
                        setSelectedComplaint(latestComplaint || null);
                      }}
                      className="text-blue-600 hover:text-blue-900 transition duration-150"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  You have not submitted any complaints yet. 📝
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Complaint Detail Modal/Panel */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-3xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-blue-900">Complaint Details (#{selectedComplaint.id})</h3>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            
            {/* Resolution Display (Separate Panel) */}
            {selectedComplaint.status === 'Resolved' && selectedComplaint.feedback && (
                <div className="mb-6 p-5 border-2 border-green-400 bg-green-50 rounded-lg shadow-inner">
                    <h4 className="text-xl font-bold text-green-700 mb-2 flex items-center">
                        ✅ Official Resolution Issued
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.feedback}</p>
                </div>
            )}
            
            {/* Ongoing Feedback/Status */}
            {selectedComplaint.status !== 'Resolved' && selectedComplaint.feedback && (
                <div className="mb-6 p-4 border-l-4 border-blue-400 bg-blue-50 rounded-md">
                    <p className="font-semibold text-gray-600 mb-1">Latest Internal Communication:</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedComplaint.feedback}</p>
                </div>
            )}


            {/* Complaint Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                    <p className="font-semibold text-gray-600">Course:</p>
                    <p className="text-gray-800">{selectedComplaint.courseCode} - {selectedComplaint.courseTitle}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Lecturer Assigned:</p>
                    <p className="text-gray-800">{selectedComplaint.lecturerName || 'N/A'}</p> 
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Complaint Type:</p>
                    <p className="text-gray-800">{selectedComplaint.type}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Current Status:</p>
                    <StatusBadge status={selectedComplaint.status} />
                </div>
            </div>

            <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">Issue Description:</p>
                <p className="text-gray-700 p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">{selectedComplaint.description}</p>
            </div>
            
            {/* History Timeline */}
            <div className="border-t pt-4">
                <h4 className="text-lg font-bold text-gray-700 mb-2">Complaint Timeline:</h4>
                <HistoryTimeline history={selectedComplaint.history} />
            </div>

            {/* Student Update/Reopen Form (Action Required) */}
            {selectedComplaint.status === 'Awaiting Student Response' && (
                <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-lg">
                    <h4 className="text-xl font-bold text-red-700 mb-3">Action Required! 🔴</h4>
                    <p className="mb-3 text-red-600">The lecturer or admin has requested more information or clarification. Please respond below to continue processing your complaint.</p>
                    
                    {updateError && <div className="p-2 mb-2 bg-red-200 text-red-800 rounded-md text-sm">{updateError}</div>}
                    {updateSuccess && <div className="p-2 mb-2 bg-green-200 text-green-800 rounded-md text-sm">{updateSuccess}</div>}

                    <form onSubmit={handleUpdate} className="space-y-3">
                        <textarea
                            name="reopenMessage"
                            rows={3}
                            required
                            value={reopenMessage}
                            onChange={(e) => setReopenMessage(e.target.value)}
                            placeholder="Provide your clarification or requested evidence here..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                            Submit Information & Resume Review
                        </button>
                    </form>
                </div>
            )}

            <div className="mt-4 flex justify-end border-t pt-4">
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

export default TrackComplaint;