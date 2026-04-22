import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ResumeFormWizard from './pages/ResumeFormWizard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import ModernUserDashboard from './pages/ModernUserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ResumeUpload from './pages/ResumeUpload';
import ResumeAnalysis from './pages/ResumeAnalysis';
import MyResumes from './pages/MyResumes';
import CareerSuggestions from './pages/CareerSuggestions';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (requireAdmin && user?.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/create-resume"
                element={
                  <ProtectedRoute>
                    <ResumeFormWizard onSubmit={() => {}} />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ModernUserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/user" 
                element={
                  <ProtectedRoute>
                    <ModernUserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-resume" 
                element={
                  <ProtectedRoute>
                    <ResumeUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-resumes" 
                element={
                  <ProtectedRoute>
                    <MyResumes />
                  </ProtectedRoute>
                } 
              />

              {/* Admin auth routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-signup" element={<AdminSignup />} />
              <Route 
                path="/resume/:id" 
                element={
                  <ProtectedRoute>
                    <ResumeAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/career-suggestions" 
                element={
                  <ProtectedRoute>
                    <CareerSuggestions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
