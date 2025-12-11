// src/types.ts (FINAL COMPLETE VERSION)

// --- 1. User Types ---

export type UserRole = 'student' | 'lecturer' | 'admin';

/**
 * @interface BaseUser
 * Defines properties common to all users in the system.
 */
export interface BaseUser {
  id: string; // Unique identifier (Matric number, Lecturer ID, or Admin ID)
  password: string;
  name: string;
  role: UserRole;
  email: string; // Required for communication
  phoneNumber?: string;
  isActive: boolean; // For Admin management (deactivation)
}

/**
 * @interface Student
 * Extends BaseUser with specific academic properties.
 */
export interface Student extends BaseUser {
  role: 'student';
  department: string;
  level: string; // e.g., '100', '200', '400'
}

/**
 * @interface Lecturer
 * Extends BaseUser with department context for assignment.
 */
export interface Lecturer extends BaseUser {
  role: 'lecturer';
  department: string; // Required for assignment/filtering
}

/**
 * @interface Admin
 * Extends BaseUser for system administrators.
 */
export interface Admin extends BaseUser {
  role: 'admin';
  // Admins do not require department/level specific fields
}

/**
 * @type User
 * The union type representing any active user account in the system.
 */
export type User = Student | Lecturer | Admin;


// --- 2. Complaint and Workflow Types ---

/**
 * @type ComplaintStatus
 * Defines the progression states of a complaint case.
 */
export type ComplaintStatus = 
  'Pending' |             // Initial state before admin action
  'Received' |            // Admin acknowledges submission
  'Under Review' |        // Generic review state (Lecturer or Admin)
  'Sent to Lecturer' |    // Assigned to a lecturer
  'Admin Verification' |  // Lecturer has responded, waiting for Admin's final check
  'Resolved' |            // Case successfully closed
  'Rejected' |            // Case dismissed
  'Awaiting Student Response'; // Lecturer requires clarification from student

/**
 * @interface ComplaintHistoryEntry
 * Records significant events and status changes for auditing.
 */
export interface ComplaintHistoryEntry {
  date: string;
  action: string; // Description of the action taken
  by?: string;    // User ID who performed the action
}

/**
 * @interface Complaint
 * The main data structure for a result complaint case.
 */
export interface Complaint {
  id: number;
  studentId: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string; // Name of the lecturer whose result is disputed
  department: string;
  type: string; // e.g., 'Missing results', 'Wrong score', 'Calculation error'
  description: string;
  status: ComplaintStatus;
  dateSubmitted: string;
  assignedToId: string | null; // ID of the Lecturer/Staff currently handling the case
  evidenceFile: string; // Mock file name or URL
  feedback: string; // Stores the latest summary feedback/resolution note from staff
  history: ComplaintHistoryEntry[];
}