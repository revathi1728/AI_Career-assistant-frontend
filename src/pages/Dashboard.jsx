import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, resumeAPI, careerAPI } from '../services/api';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Target, 
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [recentResumes, setRecentResumes] = useState([]);
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardResponse, resumesResponse, suggestionsResponse] = await Promise.all([
        userAPI.getDashboard(),
        resumeAPI.getResumes(),
        careerAPI.getSuggestions()
      ]);

      setDashboardData(dashboardResponse.data.dashboard);
      setRecentResumes(resumesResponse.data.resumes.slice(0, 3));
      setRecentSuggestions(suggestionsResponse.data.suggestions.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Ready to take your career to the next level? Let's get started.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Resumes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.stats?.resumesCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Career Suggestions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.stats?.suggestionsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Target className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.stats?.completionRate || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.recentResumes?.length > 0 
                  ? Math.round(dashboardData.recentResumes.reduce((sum, r) => sum + (r.score || 0), 0) / dashboardData.recentResumes.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/upload-resume"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200"
            >
              <Upload className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-700">Upload New Resume</span>
            </Link>
            <Link
              to="/career-suggestions"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200"
            >
              <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-gray-700">View Career Suggestions</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
            >
              <Target className="w-5 h-5 text-purple-600 mr-3" />
              <span className="text-gray-700">Update Profile</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData?.recentResumes?.length > 0 ? (
              dashboardData.recentResumes.map((resume, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700 truncate">
                      {resume.fileName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {resume.score}/100
                    </span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Resumes */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Resumes</h3>
          <Link
            to="/upload-resume"
            className="btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Resume
          </Link>
        </div>

        {recentResumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentResumes.map((resume) => (
              <div key={resume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-gray-500">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2 truncate">
                  {resume.originalFileName}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Score: {resume.aiAnalysis?.score || 'N/A'}
                  </span>
                  <Link
                    to={`/resume/${resume.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No resumes uploaded yet</p>
            <Link to="/upload-resume" className="btn-primary">
              Upload Your First Resume
            </Link>
          </div>
        )}
      </div>

      {/* Recent Career Suggestions */}
      {recentSuggestions.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Career Suggestions</h3>
            <Link
              to="/career-suggestions"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {suggestion.resumeName}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date(suggestion.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {suggestion.suggestionsCount} suggestions generated
                </p>
                <Link
                  to={`/career-suggestions/${suggestion.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Suggestions
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
