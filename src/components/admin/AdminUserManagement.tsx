// src/components/admin/AdminUserManagement.tsx (FINAL FIX)
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// Note: Keeping unused type imports is bad practice, but based on your previous logs, 
// Lecturer/Admin were removed in the last round. User/UserRole/Student are kept as they are used.
import type { User, UserRole, Student } from '../../types'; 

const AdminUserManagement: React.FC = () => {
  const { appUsers, registerUser, manageUserAccount } = useAuth();
  
  // FIX 1: Explicitly add 'department' to the form state type.
  // This resolves TS2353/TS2339 errors related to 'department' in state initialization and usage (Lines 22, 50, 219).
  type NewUserFormType = Omit<User, 'isActive'> & { 
        department: string; 
    }; 

  // Initialize state for the new user form. 
  const initialNewUserState: NewUserFormType = { 
      id: '', 
      name: '', 
      email: '', 
      phoneNumber: '',
      department: '', // Now correctly known by NewUserFormType
      role: 'lecturer' as UserRole,
      password: 'password123', // Mandatory field for registration
  };

  // State now uses the correctly extended type (NewUserFormType)
  const [newUser, setNewUser] = useState<NewUserFormType>(initialNewUserState);
  
  // Corrected type definition for the message state
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'register'>('view');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');

  // Filtered list of users for the 'view' tab
  const filteredUsers = appUsers.filter(u => 
      filterRole === 'all' || u.role === filterRole
  ).slice().sort((a, b) => a.role.localeCompare(b.role) || a.id.localeCompare(b.id));

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // department access is now safe.
    if ((newUser.role === 'lecturer' || newUser.role === 'admin') && (!newUser.id.trim() || !newUser.department.trim() || !newUser.email.trim())) {
        setMessage({ type: 'error', text: 'All fields (ID, Name, Email, Department) are required for staff registration.' });
        return;
    }
    
    const result = registerUser(newUser);

    // Casting the result object to match the Message state type
    setMessage(result.success ? { type: 'success', text: result.message } : { type: 'error', text: result.message });
    
    if (result.success) {
      setNewUser({...initialNewUserState, role: newUser.role}); // Keep the last selected role
      setActiveTab('view');
      setFilterRole(newUser.role);
    }
  };
  
  const handleAccountAction = (userId: string, action: 'resetPassword' | 'deactivate' | 'reactivate', userName: string) => {
      setMessage(null);
      if (action === 'deactivate' && !window.confirm(`Are you sure you want to DEACTIVATE ${userName} (${userId})?`)) return;
      if (action === 'resetPassword' && !window.confirm(`Are you sure you want to reset the password for ${userName} (${userId}) to 'password123'?`)) return;
      
      const result = manageUserAccount(userId, action);
      // Casting the result object to match the Message state type
      setMessage(result.success ? { type: 'success', text: result.message } : { type: 'error', text: result.message });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">System User Management</h2>

      {message && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700 font-medium' : 'bg-red-100 text-red-700 font-medium'}`}>
          {message.text}
        </div>
      )}

      {/* Tabbed Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button 
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition duration-150 ${activeTab === 'view' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            👥 View All Users
        </button>
        <button 
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition duration-150 ${activeTab === 'register' ? 'bg-green-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
        >
            ➕ Register New Staff
        </button>
      </div>

      {/* View Users Tab */}
      {activeTab === 'view' && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-bold text-gray-800">System Users ({filteredUsers.length})</h3>
             <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | UserRole)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
             >
                 <option value="all">Filter by Role (All)</option>
                 <option value="student">Student</option>
                 <option value="lecturer">Lecturer</option>
                 <option value="admin">Admin</option>
             </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role / Dept</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={!user.isActive ? 'bg-gray-50 opacity-70' : ''}>
                    <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 capitalize text-gray-600">
                        {user.role} 
                        {/* FIX 2: Use Type Assertion (as any) to access department if role implies its presence. 
                           This suppresses the TS2339 error for property 'department' not existing on base User type. */}
                        {(user.role === 'lecturer' || user.role === 'admin') ? ` / ${(user as any).department}` : ''}
                        {(user as Student).level ? ` (${(user as Student).level})` : ''}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => handleAccountAction(user.id, 'resetPassword', user.name)}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-medium"
                      >
                        Reset Pass
                      </button>
                      {user.isActive ? (
                        <button 
                            onClick={() => handleAccountAction(user.id, 'deactivate', user.name)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                            Deactivate
                        </button>
                      ) : (
                        <button 
                            onClick={() => handleAccountAction(user.id, 'reactivate', user.name)}
                            className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                            Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register New User Tab */}
      {activeTab === 'register' && (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Register New System User (Lecturer/Admin)</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Role Selector */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">User Role</label>
              <select
                id="role"
                name="role"
                required
                value={newUser.role}
                onChange={handleNewUserChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
                <option value="student" disabled>Student (Register via Signup Page)</option>
              </select>
            </div>
            
            {/* ID and Name */}
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700">User ID (e.g., LCT/001)</label>
                    <input id="id" name="id" type="text" required value={newUser.id} onChange={handleNewUserChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input id="name" name="name" type="text" required value={newUser.name} onChange={handleNewUserChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>

            {/* Department and Email */}
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <input id="department" name="department" type="text" required value={newUser.department} onChange={handleNewUserChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" name="email" type="email" required value={newUser.email} onChange={handleNewUserChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>
            
            {/* Phone Number (Optional) */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" value={newUser.phoneNumber} onChange={handleNewUserChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>


            <p className="text-xs text-gray-500 pt-2">
                **Note:** The initial password will be set to the default value: `password123`.
            </p>

            <button type="submit" className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
              Register New {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;