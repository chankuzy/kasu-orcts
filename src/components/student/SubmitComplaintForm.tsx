// src/components/student/SubmitComplaintForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';

// Available complaint types (3.A. Complaint form contains)
const COMPLAINT_TYPES = [
  'Missing results',
  'Wrong score',
  'Incomplete score (CA or Exam)',
  'Not uploaded',
  'Wrong grade',
  'Other'
];

const SubmitComplaintForm: React.FC = () => {
  const { currentUser } = useAuth();
  const { submitComplaint } = useComplaints();
  
  // Initial state for the complaint form
  const [formData, setFormData] = useState({
    courseCode: '',
    courseTitle: '',
    lecturerName: '',
    department: currentUser?.department || '', // Auto-fill student's department
    type: COMPLAINT_TYPES[0],
    description: '',
    // Note: fileEvidence is only a string (filename) for front-end mock
    evidenceFile: '', 
  });
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 6. FULL FILE UPLOAD SYSTEM (Mock Implementation)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Simulate file check/naming
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB.');
        setFile(null);
        setFormData({...formData, evidenceFile: ''});
        return;
      }
      setFile(selectedFile);
      // Use the file name as the mock evidence path
      setFormData({...formData, evidenceFile: selectedFile.name}); 
      setError('');
    } else {
        setFile(null);
        setFormData({...formData, evidenceFile: ''});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser || currentUser.role !== 'student') {
        setError('Authentication error. Please log in as a student.');
        return;
    }
    if (!formData.courseCode || !formData.lecturerName || !formData.description) {
        setError('Please fill out all required fields (Course, Lecturer, Description).');
        return;
    }
    
    // Construct the complaint object
    const newComplaint = {
      ...formData,
      studentId: currentUser.id,
      lecturerName: formData.lecturerName.trim(), // Clean up input
    };

    // Submit the complaint to context (which saves to localStorage)
    const submitted = submitComplaint(newComplaint);

    if (submitted) {
      setSuccess('Complaint submitted successfully! You can now track its status.');
      // Reset form
      setFormData({
        courseCode: '',
        courseTitle: '',
        lecturerName: '',
        department: currentUser.department,
        type: COMPLAINT_TYPES[0],
        description: '',
        evidenceFile: '',
      });
      setFile(null);
    } else {
      setError('An error occurred during submission.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Submit a New Result Complaint</h2>
      <p className="text-gray-600 mb-6">
        Use this form to report issues like missing scores, incorrect grades, or incomplete results.
      </p>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 border border-red-300 rounded-md">{error}</div>}
      {success && <div className="p-3 mb-4 bg-green-100 text-green-700 border border-green-300 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Course Code */}
          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code <span className="text-red-500">*</span></label>
            <input
              id="courseCode"
              name="courseCode"
              type="text"
              required
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g., CSC 401"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Course Title */}
          <div>
            <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">Course Title</label>
            <input
              id="courseTitle"
              name="courseTitle"
              type="text"
              value={formData.courseTitle}
              onChange={handleChange}
              placeholder="e.g., Formal Methods"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lecturer Name */}
          <div>
            <label htmlFor="lecturerName" className="block text-sm font-medium text-gray-700">Lecturer Name <span className="text-red-500">*</span></label>
            <input
              id="lecturerName"
              name="lecturerName"
              type="text"
              required
              value={formData.lecturerName}
              onChange={handleChange}
              placeholder="e.g., Dr. Adamu Umar"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* Type of Complaint */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type of Complaint <span className="text-red-500">*</span></label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            >
              {COMPLAINT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description Text */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description <span className="text-red-500">*</span></label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Please explain the issue clearly. Include details like the semester, academic session, and what you believe the correct result should be."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* File Upload (Evidence) */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <label htmlFor="evidenceFile" className="block text-sm font-medium text-gray-700 mb-2">Evidence File Upload (Optional)</label>
          <input
            id="evidenceFile"
            name="evidenceFile"
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png, .pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-900
              hover:file:bg-blue-100"
          />
          <p className="mt-2 text-xs text-gray-500">
            Accepted formats: PDF, JPG, PNG. Maximum size: 5MB. **(Simulated upload)**
          </p>
          {file && <p className="mt-1 text-sm text-green-600">File attached: {file.name}</p>}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaintForm;