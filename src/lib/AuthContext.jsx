import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from './api/client';

// AuthContext - handles all authentication through Express backend API
// No direct Supabase usage in frontend

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const teacherAuth = localStorage.getItem('Authteachers');
        const studentAuth = localStorage.getItem('Authstudents');

        if (teacherAuth) {
          const teacherData = JSON.parse(teacherAuth);
          setUser({ ...teacherData, userType: 'teacher' });
          setIsAuthenticated(true);
        } else if (studentAuth) {
          const studentData = JSON.parse(studentAuth);
          setUser({ ...studentData, userType: 'student' });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear corrupted auth data
        localStorage.removeItem('Authteachers');
        localStorage.removeItem('Authstudents');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Teacher registration
  const registerTeacher = async (teacherData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.TEACHER_REGISTER, {
        name: teacherData.name,
        email: teacherData.email,
        password: 'defaultPassword123' // In production, collect this from form
      });
      
      if (response.success) {
        const userData = { ...response.teacher, userType: 'teacher' };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('Authteachers', JSON.stringify(response.teacher));
        return { success: true, data: userData };
      } else {
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login (both teacher and student)
  const login = async (email, password, userType) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
        userType
      });
      
      if (response.success) {
        const userData = { ...response.user, userType };
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store in appropriate localStorage key
        const storageKey = userType === 'teacher' ? 'Authteachers' : 'Authstudents';
        localStorage.setItem(storageKey, JSON.stringify(response.user));
        
        return { success: true, data: userData };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Student quick login/register
  const studentLogin = async (studentData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.STUDENT_LOGIN, studentData);
      
      if (response.success) {
        const userData = { ...response.user, userType: 'student' };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('Authstudents', JSON.stringify(response.user));
        return { success: true, data: userData };
      } else {
        return { success: false, error: response.error || 'Student login failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('Authteachers');
    localStorage.removeItem('Authstudents');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    
    // Update localStorage
    const storageKey = user.userType === 'teacher' ? 'Authteachers' : 'Authstudents';
    localStorage.setItem(storageKey, JSON.stringify(newUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    registerTeacher,
    login,
    studentLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
