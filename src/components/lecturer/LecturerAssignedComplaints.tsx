// src/components/lecturer/LecturerAssignedComplaints.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import  type { Complaint, ComplaintStatus } from '../../types';

// Helper component for the status badge (reused from TrackComplaint)
const StatusBadge: React.FC<{ status: ComplaintStatus }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';
  switch (status) {
    case 'Resolved':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Sent to Lecturer':
    case 'Under Review':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Awaiting Student Response':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'Admin Verification':
      colorClass = 'bg-purple-100 text-purple-800';
      break;
    case 'Rejected':
      colorClass = 'bg-pink-100 text-pink-800';
      break;
    default:
        colorClass = 'bg-yellow-100 text-yellow-800'; // Pending/Received
  }
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

const LecturerAssignedComplaints: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints, lecturerResponse } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseDetails, setResponseDetails] = useState({ action: '', comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 4.A: Filter complaints assigned to the current lecturer (by assignedToId)
  const assignedComplaints = complaints.filter(
    c => c.assignedToId === currentUser?.id && c.status !== 'Resolved' && c.status !== 'Rejected'
  );

  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setResponseDetails({ ...responseDetails, [e.target.name]: e.target.value });
  };

  // 4.B: Handle Lecturer's submission (Approve, Reject, or Request Info)
  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedComplaint) return;

    if (!responseDetails.action) {
        setError('Please select an action (Approve, Reject, or Request More Info).');
        return;
    }
    if (!responseDetails.comment.trim()) {
        setError('A comment/feedback is required for the student/admin.');
        return;
    }

    // Call the context function to update the complaint
    lecturerResponse(selectedComplaint.id, responseDetails.action as 'approve' | 'reject' | 'request_info', { comment: responseDetails.comment });
    
    setSuccess(`Response submitted successfully! The complaint status is now ${responseDetails.action === 'approve' ? 'Admin Verification' : responseDetails.action === 'reject' ? 'Rejected' : 'Awaiting Student Response'}.`);
    
    // Clear state and close modal after submission
    setResponseDetails({ action: '', comment: '' });
    setSelectedComplaint(null);
  };

  // Filter out complaints that are already fully resolved or rejected to simplify the main list
  const activeComplaints = assignedComplaints.filter(c => c.status !== 'Admin Verification');
  const forVerificationCount = assignedComplaints.filter(c => c.status === 'Admin Verification').length;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Complaints Assigned to You</h2>
      
      {forVerificationCount > 0 && (
          <div className="p-4 bg-purple-100 border border-purple-300 rounded-lg text-purple-800 font-medium">
              🔔 Note: You have **{forVerificationCount}** complaints you've processed that are currently awaiting **Admin Verification**.
          </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activeComplaints.length > 0 ? (
              activeComplaints
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((complaint) => (
                <tr key={complaint.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{complaint.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    **{complaint.courseCode}** ({complaint.type})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {complaint.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setSelectedComplaint(complaint)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                    >
                      View & Respond
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  You currently have no active complaints assigned. 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {success && (
          <div className="fixed top-4 right-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded-lg shadow-xl z-50">
              {success}
          </div>
      )}

      {/* Complaint Detail and Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-blue-900">Respond to Complaint #{selectedComplaint.id}</h3>
              <button 
                onClick={() => { setSelectedComplaint(null); setResponseDetails({ action: '', comment: '' }); setError(''); }}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            
            {/* Complaint Summary */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-4 border-b">
                <div>
                    <p className="font-semibold text-gray-600">Student ID:</p>
                    <p className="text-gray-800">{selectedComplaint.studentId}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Course / Type:</p>
                    <p className="text-gray-800">{selectedComplaint.courseCode} - {selectedComplaint.type}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Date Submitted:</p>
                    <p className="text-gray-800">{selectedComplaint.dateSubmitted}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Evidence:</p>
                    <p className="text-green-600 underline cursor-pointer">{selectedComplaint.evidenceFile || 'No file provided'}</p>
                </div>
            </div>

            <div className="mb-6">
                <p className="font-semibold text-gray-600 mb-1">Issue Description:</p>
                <p className="text-gray-700 p-3 bg-gray-50 border rounded-md whitespace-pre-wrap">{selectedComplaint.description}</p>
            </div>
            
            {/* 4.B: Result Verification and Response Form */}
            <div className="mt-6 p-6 border border-indigo-300 bg-indigo-50 rounded-lg">
                <h4 className="text-xl font-bold text-indigo-800 mb-4">Verification & Action</h4>
                
                {error && <div className="p-3 mb-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}

                <form onSubmit={handleSubmitResponse} className="space-y-4">
                    {/* Action Selector */}
                    <div>
                        <label htmlFor="action" className="block text-sm font-medium text-gray-700">Select Action <span className="text-red-500">*</span></label>
                        <select
                            id="action"
                            name="action"
                            required
                            value={responseDetails.action}
                            onChange={handleResponseChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">-- Select --</option>
                            <option value="approve">Approve Correction (Send to Admin for Final Verification)</option>
                            <option value="reject">Reject Complaint (Invalid/Unverified)</option>
                            <option value="request_info">Request More Information from Student (4.C)</option>
                        </select>
                    </div>

                    {/* Comment/Feedback */}
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Official Comment/Feedback <span className="text-red-500">*</span></label>
                        <textarea
                            id="comment"
                            name="comment"
                            rows={4}
                            required
                            value={responseDetails.comment}
                            onChange={handleResponseChange}
                            placeholder="Enter the justification for the result correction, rejection, or the information requested from the student."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                        Submit Action
                    </button>
                </form>
            </div>

            <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => { setSelectedComplaint(null); setResponseDetails({ action: '', comment: '' }); setError(''); }}
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

export default LecturerAssignedComplaints;