import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/public/Login';
import LandingPage from './components/public/LandingPage';
import SubmitComplaintForm from './components/student/SubmitComplaintForm';
import TrackComplaint from './components/student/TrackComplaint';
import StudentProfile from './components/student/StudentProfile';
import SignUp from './components/public/SignUp';
import DashboardLayout from './components/layouts/DashbaordLayout';
import StudentDashboardHome from './components/student/StudentDashboardHome';
import LecturerDashboardHome from './components/lecturer/LecturerDashboardHome';
import LecturerAssignedComplaints from './components/lecturer/LecturerAssignedComplaints';

import AdminDashboardHome from './components/admin/AdminDashboardHome';
import AdminManageComplaints from './components/admin/AdminManageComplaints';
import AdminUserManagement from './components/admin/AdminUserManagement';
import AdminComplaintAnalytics from './components/admin/AdminComplaintsAnalytics';
import AdminSystemSettings from './components/admin/AdminSystemSettings';

// --- ProtectedRoute Component (Unchanged) ---
const ProtectedRoute = ({ children, allowedRoles }: any) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(currentUser.role)) {
    // Redirects a logged-in user to their correct dashboard if they try to access another role's route
    return <Navigate to={`/${currentUser.role}/home`} replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        {/* STUDENT Protected Routes (3. STUDENT DASHBOARD) */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout role="student">
                <Routes>
                  <Route path="home" element={<StudentDashboardHome />} />
                  <Route path="submit" element={<SubmitComplaintForm />} />
                  <Route path="track" element={<TrackComplaint />} />
                  <Route path="history" element={<TrackComplaint />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* LECTURER Protected Routes (4. LECTURER DASHBOARD) */}
        <Route
          path="/lecturer/*"
          element={
            <ProtectedRoute allowedRoles={['lecturer']}>
              <DashboardLayout role="lecturer">
                <Routes>
                  <Route path="home" element={<LecturerDashboardHome />} />
                  <Route path="complaints" element={<LecturerAssignedComplaints />} />
                  <Route path="verify" element={<LecturerAssignedComplaints />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN Protected Routes (5. ADMIN DASHBOARD) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout role="admin">
                <Routes>
                  {/* Core Admin Routes */}
                  <Route path="home" element={<AdminDashboardHome />} />
                  
                  {/* ADDED ADMIN ROUTES */}
                  <Route path="manage" element={<AdminManageComplaints />} />
                  <Route path="users" element={<AdminUserManagement />} />
                  <Route path="analytics" element={<AdminComplaintAnalytics />} />
                  <Route path="settings" element={<AdminSystemSettings />} />

                  {/* Fallback to Admin Home */}
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;