import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import CreateTest from './pages/teacher/CreateTest';
import SubmittedTests from './pages/teacher/SubmittedTests';
import TakeTest from './pages/student/TakeTest';
import TestResults from './pages/student/TestResults';
import Tests from './pages/student/Tests';
import DemoTest from './pages/student/DemoTest';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import Bootstrap JS for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Note: Frontend uses Express backend API only - no direct Supabase connection

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Protected Teacher Routes */}
            <Route 
              path="/teacher/dashboard" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/create-test" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <CreateTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher/results" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <SubmittedTests />
                </ProtectedRoute>
              } 
            />

            {/* Protected Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/test/:testId" 
              element={
                <ProtectedRoute requiredRole="student">
                  <TakeTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/tests" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Tests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/results" 
              element={
                <ProtectedRoute requiredRole="student">
                  <TestResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student/demo-test" 
              element={
                <ProtectedRoute requiredRole="student">
                  <DemoTest />
                </ProtectedRoute>
              } 
            />

            {/* Fallback Routes */}
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
