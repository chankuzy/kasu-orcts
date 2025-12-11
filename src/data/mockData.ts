import type { Complaint, User } from "../types";


export const MOCK_USERS: User[] = [
  // Admin
  { id: "KASU/ADMIN/001", password: "admin", name: "Super Admin", role: "admin" } as User,
  // Lecturer (Assigned to CSC 401)
  { id: "KASU/STF/CS/012", password: "lecturer", name: "Dr. Adamu Umar", role: "lecturer", department: "Computer Science" } as User,
  // Students
  { id: "KASU/19/CS/1001", password: "student", name: "Aisha Musa", role: "student", department: "Computer Science", level: "400" } as User,
  { id: "KASU/19/ENG/023", password: "student", name: "Bello Sani", role: "student", department: "Engineering", level: "300" } as User,
];

export const MOCK_COMPLAINTS: Complaint[] = [
  // ... (Complaint data remains the same structure, but now typed)
  {
    id: 1,
    studentId: "KASU/19/CS/1001",
    courseCode: "CSC 401",
    courseTitle: "Formal Methods",
    lecturerName: "Dr. Adamu Umar",
    department: "Computer Science",
    type: "Missing results",
    description: "My CSC 401 result is missing from the portal. I confirmed my score was recorded.",
    status: "Sent to Lecturer",
    dateSubmitted: "2025-01-15",
    assignedToId: "KASU/STF/CS/012",
    evidenceFile: "evidence_aisha_csc401.pdf",
    feedback: "",
    history: [
      { date: "2025-01-15 10:00", action: "Complaint submitted" },
      { date: "2025-01-15 14:30", action: "Assigned to KASU/STF/CS/012 by Admin" },
    ],
  },
  {
    id: 2,
    studentId: "KASU/19/ENG/023",
    courseCode: "ENG 305",
    courseTitle: "Thermodynamics II",
    lecturerName: "Prof. Halima Kabir",
    department: "Engineering",
    type: "Wrong score",
    description: "I received 45/100, but my CA alone was 30/30.",
    status: "Resolved",
    dateSubmitted: "2025-01-10",
    assignedToId: "KASU/STF/ENG/055",
    evidenceFile: "evidence_bello_eng305.jpg",
    feedback: "Correction approved. Final score updated to 75. Case closed.",
    history: [
      { date: "2025-01-10 09:00", action: "Complaint submitted" },
      { date: "2025-01-12 11:00", action: "Lecturer responded with correction" },
      { date: "2025-01-12 15:00", action: "Admin Verified and Resolved" },
    ],
  },
];