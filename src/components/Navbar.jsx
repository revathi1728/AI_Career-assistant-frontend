import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  LogOut, 
  Upload, 
  FileText, 
  TrendingUp, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Career Portal</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
              {user?.isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/upload-resume" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Upload Resume
              </NavLink>
              <NavLink to="/my-resumes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                My Resumes
              </NavLink>
              <NavLink to="/career-suggestions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Career Suggestions
              </NavLink>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link btn-primary active' : 'nav-link btn-primary'}>
                Sign Up
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-4">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/upload-resume"
                  className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Upload Resume
                </NavLink>
                <NavLink
                  to="/my-resumes"
                  className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Resumes
                </NavLink>
                <NavLink
                  to="/career-suggestions"
                  className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Career Suggestions
                </NavLink>
                {user?.isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'block nav-link active' : 'block nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? 'block btn-primary text-center nav-link active' : 'block btn-primary text-center nav-link')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
