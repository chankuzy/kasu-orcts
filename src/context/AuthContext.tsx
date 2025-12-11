import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { MOCK_USERS } from '../data/mockData';
// Ensure these types are correctly defined as a Discriminated Union in '../types'
import type { User, Student, UserRole, Lecturer } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (id: string, password: string) => { success: boolean; role?: UserRole; message?: string };
  logout: () => void;
  // Adjusted type for registerUser to simplify casting logic
  registerUser: (
    user: Omit<User, 'isActive'> & { password?: string }
  ) => { success: boolean; message: string };
  manageUserAccount: (
    userId: string,
    action: 'resetPassword' | 'deactivate' | 'reactivate',
    payload?: string
  ) => { success: boolean; message: string };
  // Student registration is simplified to use the Student structure directly
  registerStudent: (newStudent: Omit<Student, 'role' | 'isActive'> & { password: string }) => { success: boolean; message?: string };
  updateProfile: (updatedData: Partial<User>) => { success: boolean; message?: string };
  appUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize app users from storage or mock
const initializeUsers = (): User[] => {
  const storedUsers = localStorage.getItem('appUsers');

  if (!storedUsers) {
    // FIX 1: We must assert MOCK_USERS as User[] here, relying on the type definitions being correct.
    const usersWithDefaults = MOCK_USERS.map(user => ({
      ...user,
      isActive: true,
      // Ensure 'level' and 'department' are present for Student mocks if using the base type
      email: user.email || `${user.id}@kasu.edu`,
    })) as User[];

    localStorage.setItem('appUsers', JSON.stringify(usersWithDefaults));
    return usersWithDefaults;
  }

  const stored: User[] = JSON.parse(storedUsers);

  const corrected = stored.map(user => {
    const isMock = MOCK_USERS.some(mock => mock.id === user.id);
    return {
      ...user,
      isActive: isMock ? true : user.isActive,
      email: user.email || `${user.id}@kasu.edu`,
    };
  });

  localStorage.setItem('appUsers', JSON.stringify(corrected));
  return corrected;
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
    const user = appUsers.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === password);

    if (user && user.isActive) {
      setCurrentUser(user);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, role: user.role };
    }
    if (user && !user.isActive) {
      return { success: false, message: 'Account deactivated. Contact Admin.' };
    }
    return { success: false, message: 'Invalid ID or Password' };
  };

  const registerUser: AuthContextType['registerUser'] = newUser => {
    if (appUsers.some(u => u.id === newUser.id)) {
      return { success: false, message: `User ID ${newUser.id} already exists.` };
    }

    const password = newUser.password || 'password123';
    
    // FIX 2: Explicitly define the base properties and then build the discriminated union object.
    const baseProps = {
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      id: newUser.id,
      password,
      isActive: true,
    };

    let userObject: User;

    // Use a switch or if/else chain to narrow the role and assign specific properties
    if (newUser.role === 'student') {
      // The casting is now to ensure we pull 'level' and 'department' from the input
      const studentData = newUser as Partial<Student>;
      userObject = {
        ...baseProps,
        role: 'student', // Discriminating literal
        level: studentData.level || '100', // Safely pulling student-specific data
        department: studentData.department || 'N/A',
      };
    } else if (newUser.role === 'lecturer') {
      const lecturerData = newUser as Partial<Lecturer>;
      userObject = {
        ...baseProps,
        role: 'lecturer', // Discriminating literal
        department: lecturerData.department || 'N/A', // Safely pulling lecturer-specific data
      };
    } else {
      userObject = {
        ...baseProps,
        role: 'admin', // Discriminating literal
      };
    }

    const updated = [...appUsers, userObject];
    setAppUsers(updated);
    localStorage.setItem('appUsers', JSON.stringify(updated));

    return {
      success: true,
      message: `${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} ${newUser.name} created successfully! Default password: ${password}`,
    };
  };

  const manageUserAccount: AuthContextType['manageUserAccount'] = (userId, action, payload) => {
    const target = appUsers.find(u => u.id === userId);
    if (!target) return { success: false, message: 'User not found.' };

    let updatedUser = { ...target };
    let message = '';

    if (action === 'resetPassword') {
      const newPass = payload || 'password123';
      updatedUser.password = newPass;
      message = `Password reset to: ${newPass}`;
    } else if (action === 'deactivate') {
      updatedUser.isActive = false;
      message = `User ${userId} deactivated.`;
    } else if (action === 'reactivate') {
      updatedUser.isActive = true;
      message = `User ${userId} reactivated.`;
    }

    const updated = appUsers.map(u => (u.id === userId ? updatedUser : u));
    setAppUsers(updated);
    localStorage.setItem('appUsers', JSON.stringify(updated));

    if (currentUser?.id === userId && action === 'deactivate') logout();

    return { success: true, message };
  };

  const registerStudent: AuthContextType['registerStudent'] = newStudentData => {
    const exists = appUsers.some(u => u.id.toLowerCase() === newStudentData.id.toLowerCase());
    if (exists) return { success: false, message: 'Matric Number already registered.' };

    const newStudent: Student = {
      ...newStudentData,
      role: 'student',
      level: newStudentData.level || '100',
      isActive: true,
    };

    const updated = [...appUsers, newStudent];
    setAppUsers(updated);
    localStorage.setItem('appUsers', JSON.stringify(updated));

    return { success: true, message: 'Student registered.' };
  };

  const updateProfile: AuthContextType['updateProfile'] = updatedData => {
    if (!currentUser) return { success: false, message: 'User not authenticated.' };

    // FIX 3: Ensure the merged user object is explicitly cast back to the current user's role type.
    const updatedUser = {
      ...currentUser,
      ...updatedData,
      // Retain discriminating properties and ensure all required fields are present
      id: currentUser.id,
      role: currentUser.role,
      isActive: currentUser.isActive,
      email: updatedData.email ?? currentUser.email,
      name: updatedData.name ?? currentUser.name,
      password: updatedData.password ?? currentUser.password,
    } as User; 

    const updated = appUsers.map(u => (u.id === currentUser.id ? updatedUser : u));
    setAppUsers(updated);
    localStorage.setItem('appUsers', JSON.stringify(updated));

    setCurrentUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

    return {
      success: true,
      message:
        updatedData.password && updatedData.password !== currentUser.password
          ? 'Profile and Password updated successfully.'
          : 'Profile updated successfully.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    logout,
    registerUser,
    manageUserAccount,
    registerStudent,
    updateProfile,
    appUsers,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};