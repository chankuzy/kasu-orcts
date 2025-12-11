import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { MOCK_USERS } from '../data/mockData';
import type { User, Student, UserRole, Lecturer, Admin } from '../types'

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (id: string, password: string) => { success: boolean, role?: UserRole, message?: string };
  logout: () => void;
  registerUser: (user: Omit<User, 'password' | 'isActive'> & { role: UserRole, password?: string }) => { success: boolean, message: string }; 
  manageUserAccount: (userId: string, action: 'resetPassword' | 'deactivate' | 'reactivate', payload?: string) => { success: boolean, message: string };
  registerStudent: (newStudent: Omit<Student, 'role'> & { password: string }) => { success: boolean, message?: string };
  appUsers: User[];
  updateProfile: (updatedData: Partial<User>) => { success: boolean, message?: string }; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to get users from localStorage or use mock data
const initializeUsers = (): User[] => {
  const storedUsers = localStorage.getItem('appUsers');
  
  if (!storedUsers) {
    // Case 1: No users in storage (First load)
    const usersWithDefaults = MOCK_USERS.map(user => ({
        isActive: true, // Guarantees all initial mock users are active
        email: user.email || `${user.id}@kasu.edu`,
        ...user,
    })) as User[];

    localStorage.setItem('appUsers', JSON.stringify(usersWithDefaults));
    return usersWithDefaults;
  }
  
  // Case 2: Users exist in storage (Subsequent loads)
  const stored: User[] = JSON.parse(storedUsers);
  
  // ROBUST PERSISTENCE FIX: Force-reactivate ANY user whose ID is found in the MOCK_USERS list
  const correctedUsers = stored.map(user => {
      let correctedUser = { ...user };
      
      // Check if the user ID exists in the original mock data
      const isMockUser = MOCK_USERS.some(mock => mock.id === user.id);
      
      if (isMockUser) {
          correctedUser.isActive = true; // FORCE REACTIVATION for all core testing accounts
      }
      
      // Ensure email fallback if older stored data is missing it
      if (!correctedUser.email) {
          correctedUser.email = `${user.id}@kasu.edu`;
      }
      return correctedUser;
  }) as User[];
  
  localStorage.setItem('appUsers', JSON.stringify(correctedUsers));
  return correctedUsers;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUsers, setAppUsers] = useState<User[]>(initializeUsers());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser) as User);
    }
    setLoading(false);
  }, []);

  const login: AuthContextType['login'] = (id, password) => {
    // Finds user by case-insensitive ID
    const user = appUsers.find(
      u => u.id.toLowerCase() === id.toLowerCase() && u.password === password
    );

    if (user && user.isActive) { // Check isActive status
      setCurrentUser(user);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, role: user.role };
    }
    if (user && !user.isActive) {
        return { success: false, message: 'Account deactivated. Contact Admin.' };
    }
    return { success: false, message: 'Invalid ID or Password' };
  };
  
  const registerUser: AuthContextType['registerUser'] = (newUser) => {
    if (appUsers.some(user => user.id === newUser.id)) {
      return { success: false, message: `User ID ${newUser.id} already exists.` };
    }
    
    const password = newUser.password || 'password123';
    
    // Base properties (now guaranteed on BaseUser)
    const baseUserObject = {
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        id: newUser.id,
        password: password,
        role: newUser.role,
        isActive: true,
    };

    let userObject: User;

    // Type casting based on role to satisfy required properties
    if (newUser.role === 'student') {
        userObject = { ...baseUserObject, level: (newUser as Student).level || '100', department: (newUser as Student).department || 'N/A' } as Student;
    } else if (newUser.role === 'lecturer') {
         userObject = { ...baseUserObject, department: (newUser as Lecturer).department || 'N/A' } as Lecturer;
    } else {
        userObject = baseUserObject as Admin; // Admin
    }

    const updatedUsersList = [...appUsers, userObject];
    setAppUsers(updatedUsersList);
    localStorage.setItem('appUsers', JSON.stringify(updatedUsersList));
    
    return { success: true, message: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} ${newUser.name} created successfully! Default password: **${password}**` };
  };
  
  // 5.D. Admin: Manage User Account (Reset Password / Deactivate)
  const manageUserAccount: AuthContextType['manageUserAccount'] = (userId, action, payload) => {
    const targetUser = appUsers.find(u => u.id === userId);
    if (!targetUser) return { success: false, message: 'User not found.' };

    // targetUser is of type User, which now has .isActive
    let updatedUser = { ...targetUser }; 
    let message = '';
    
    if (action === 'resetPassword') {
        const newPassword = payload || 'password123';
        updatedUser.password = newPassword;
        message = `Password for ${userId} reset to: **${newPassword}**`;
    } else if (action === 'deactivate') {
        updatedUser.isActive = false;
        message = `User ${userId} deactivated successfully.`;
    } else if (action === 'reactivate') {
        updatedUser.isActive = true;
        message = `User ${userId} reactivated successfully.`;
    } else {
        return { success: false, message: 'Invalid action.' };
    }
    
    const updatedUsersList = appUsers.map(user => 
        user.id === userId ? updatedUser : user
    );

    setAppUsers(updatedUsersList);
    localStorage.setItem('appUsers', JSON.stringify(updatedUsersList));
    
    // Force logout if the current user deactivates themselves
    if (currentUser?.id === userId && action === 'deactivate') {
        logout();
    }

    return { success: true, message };
  };

  // Student/Lecturer Profile Update
  const updateProfile: AuthContextType['updateProfile'] = (updatedData) => {
    if (!currentUser) return { success: false, message: 'User not authenticated.' };

    const isPasswordChange = updatedData.password && updatedData.password !== currentUser.password;
    
    // Merge existing user data with updated data
    let updatedUser: User = {
        ...currentUser,
        ...updatedData,
        // Ensure required fields that might be missing in Partial<User> are retained from currentUser
        id: currentUser.id,
        role: currentUser.role,
        isActive: currentUser.isActive,
        email: updatedData.email ?? currentUser.email, // Use nullish coalescing for required fields
        name: updatedData.name ?? currentUser.name,
        password: updatedData.password ?? currentUser.password,
    };

    // Update user list
    const updatedUsersList = appUsers.map(user =>
        user.id === currentUser.id ? updatedUser : user
    );

    setAppUsers(updatedUsersList);
    localStorage.setItem('appUsers', JSON.stringify(updatedUsersList));

    setCurrentUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

    return {
        success: true,
        message: isPasswordChange
        ? 'Profile and Password updated successfully.'
        : 'Profile updated successfully.'
    };
    };


  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const registerStudent: AuthContextType['registerStudent'] = (newStudentData) => {
    const exists = appUsers.some(u => u.id.toLowerCase() === newStudentData.id.toLowerCase());
    if (exists) {
        return { success: false, message: 'Matric Number already registered.' };
    }
    
    const newStudent: Student = { 
        ...newStudentData, 
        role: 'student' as const, 
        level: newStudentData.level || '100',
        isActive: true, // Default active
    };
    
    const updatedUsers = [...appUsers, newStudent];
    setAppUsers(updatedUsers);
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    updateProfile,
    registerStudent,
    appUsers,
    registerUser,       
    manageUserAccount,  
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};