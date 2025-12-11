// src/contexts/ComplaintContext.tsx
import React, { createContext, useState, useContext, type ReactNode } from 'react';
import { MOCK_COMPLAINTS } from '../data/mockData';
import type { Complaint, ComplaintStatus } from '../types'; // Import necessary types

// 1. Define the Context Type
interface ComplaintContextType {
    complaints: Complaint[];
    submitComplaint: (newComplaint: Omit<Complaint, 'id' | 'status' | 'dateSubmitted' | 'assignedToId' | 'feedback' | 'history' | 'studentId'> & { studentId: string }) => boolean;
    assignComplaint: (complaintId: number, lecturerId: string) => void;
    lecturerResponse: (complaintId: number, action: 'approve' | 'reject' | 'request_info', details: { comment: string, by: string }) => void; // Added 'by' for history
    resolveComplaint: (complaintId: number, finalMessage: string, by: string) => void; // Added 'by' for history
    updateComplaintStatus: (complaintId: number, newStatus: ComplaintStatus, message: string, by: string) => void; // Added 'by' for history
}

// Ensure the default value is typed as undefined initially
const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

// Utility function to get complaints from localStorage or use mock data
const initializeComplaints = (): Complaint[] => {
    const storedComplaints = localStorage.getItem('appComplaints');
    if (!storedComplaints) {
        localStorage.setItem('appComplaints', JSON.stringify(MOCK_COMPLAINTS));
        return MOCK_COMPLAINTS;
    }
    return JSON.parse(storedComplaints) as Complaint[];
};

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [complaints, setComplaints] = useState<Complaint[]>(initializeComplaints());

    // Function to save the updated list back to localStorage
    const saveComplaints = (updatedComplaints: Complaint[]): void => {
        setComplaints(updatedComplaints);
        localStorage.setItem('appComplaints', JSON.stringify(updatedComplaints));
    };

    // 3.A. Student: Submit a Complaint (Typed)
    const submitComplaint: ComplaintContextType['submitComplaint'] = (newComplaint) => {
        const newId = complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1;
        const date = new Date().toISOString().split('T')[0];

        const complaintObject: Complaint = {
            ...newComplaint,
            id: newId,
            status: 'Received', // Changed from 'Pending' to 'Received' to better reflect initial state
            dateSubmitted: date,
            assignedToId: null,
            feedback: "",
            history: [{ date: new Date().toLocaleString(), action: "Complaint submitted", by: newComplaint.studentId }],
        } as Complaint; // Explicit cast to Complaint type

        saveComplaints([...complaints, complaintObject]);
        return true;
    };

    // 5.B. Admin: Assign Complaint to Lecturer (Typed)
    const assignComplaint: ComplaintContextType['assignComplaint'] = (complaintId, lecturerId) => {
        const updatedComplaints = complaints.map(c =>
            c.id === complaintId
                ? {
                    ...c,
                    status: 'Sent to Lecturer' as ComplaintStatus,
                    assignedToId: lecturerId,
                    history: [...c.history, { date: new Date().toLocaleString(), action: `Assigned to ${lecturerId}`, by: "Admin" }]
                }
                : c
        );
        saveComplaints(updatedComplaints);
    };

    // 4.B/C. Lecturer: Respond to Complaint (Typed)
    const lecturerResponse: ComplaintContextType['lecturerResponse'] = (complaintId, action, details) => {
        let newStatus: ComplaintStatus;
        let actionMessage: string;

        if (action === 'approve') {
            newStatus = 'Admin Verification';
            actionMessage = `Lecturer recommended Approval. Waiting Admin Verification. Comment: ${details.comment}`;
        } else if (action === 'reject') {
            newStatus = 'Rejected';
            actionMessage = `Lecturer recommended Rejection. Comment: ${details.comment}`;
        } else if (action === 'request_info') {
            newStatus = 'Awaiting Student Response'; // CRITICAL STATUS UPDATE
            actionMessage = `Lecturer requested more information from student. Comment: ${details.comment}`;
        } else {
            return;
        }

        const updatedComplaints = complaints.map(c =>
            c.id === complaintId
                ? {
                    ...c,
                    status: newStatus,
                    feedback: details.comment,
                    history: [...c.history, { date: new Date().toLocaleString(), action: actionMessage, by: details.by }]
                }
                : c
        );
        saveComplaints(updatedComplaints);
    };

    // 5.C. Admin: Final Verification & Closure (Typed)
    const resolveComplaint: ComplaintContextType['resolveComplaint'] = (complaintId, finalMessage, by) => {
        const updatedComplaints = complaints.map(c =>
            c.id === complaintId
                ? {
                    ...c,
                    status: 'Resolved' as ComplaintStatus,
                    feedback: finalMessage,
                    history: [...c.history, { date: new Date().toLocaleString(), action: "Admin Verified and Resolved. Case Closed.", by: by }]
                }
                : c
        );
        saveComplaints(updatedComplaints);
    };
    
    // New Utility Function: Update status and add history entry (used for Student Reopen/Update)
    const updateComplaintStatus: ComplaintContextType['updateComplaintStatus'] = (complaintId, newStatus, message, by) => {
        const updatedComplaints = complaints.map(c =>
            c.id === complaintId
                ? {
                    ...c,
                    status: newStatus,
                    history: [...c.history, { date: new Date().toLocaleString(), action: message, by: by }]
                }
                : c
            );
        saveComplaints(updatedComplaints);
    }

    const value: ComplaintContextType = {
        complaints,
        submitComplaint,
        assignComplaint,
        lecturerResponse,
        resolveComplaint,
        updateComplaintStatus,
    };

    return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};

export const useComplaints = () => {
    const context = useContext(ComplaintContext);
    if (context === undefined) {
        throw new Error('useComplaints must be used within a ComplaintProvider');
    }
    return context;
};