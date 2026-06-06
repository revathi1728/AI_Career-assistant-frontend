import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { 
  FileText, 
  Eye, 
  Brain, 
  TrendingUp, 
  Trash2,
  Calendar,
  Star,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await resumeAPI.getResumes();
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resumeId);
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  // Filter and sort resumes
  const filteredAndSortedResumes = (resumes || [])
    .filter(resume => {
      const matchesSearch = resume?.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'analyzed' && resume.aiAnalysis) ||
        (filterBy === 'unanalyzed' && !resume.aiAnalysis) ||
        (filterBy === 'high-score' && resume.aiAnalysis?.score >= 80) ||
        (filterBy === 'low-score' && resume.aiAnalysis?.score < 60);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'score-high':
          return (b.aiAnalysis?.score || 0) - (a.aiAnalysis?.score || 0);
        case 'score-low':
          return (a.aiAnalysis?.score || 0) - (b.aiAnalysis?.score || 0);
        case 'name':
          return (a.originalFileName || '').localeCompare(b.originalFileName || '');
        default:
          return 0;
      }
    });

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
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchResumes} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">
            Manage and analyze your uploaded resumes
          </p>
        </div>
        <Link to="/upload-resume" className="btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Upload New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Resumes</p>
              <p className="text-2xl font-bold">{(resumes || []).length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Analyzed</p>
              <p className="text-2xl font-bold">
                {(resumes || []).filter(r => r?.aiAnalysis).length}
              </p>
            </div>
            <Brain className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Score</p>
              <p className="text-2xl font-bold">
                {(resumes || []).filter(r => r?.aiAnalysis?.score).length > 0
                  ? Math.round(
                      (resumes || [])
                        .filter(r => r?.aiAnalysis?.score)
                        .reduce((sum, r) => sum + (r?.aiAnalysis?.score || 0), 0) /
                      (resumes || []).filter(r => r?.aiAnalysis?.score).length
                    )
                  : 0}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">High Scores</p>
              <p className="text-2xl font-bold">
                {(resumes || []).filter(r => r?.aiAnalysis?.score >= 80).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Resumes</option>
              <option value="analyzed">Analyzed</option>
              <option value="unanalyzed">Not Analyzed</option>
              <option value="high-score">High Score (80+)</option>
              <option value="low-score">Low Score (&lt;60)</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="score-high">Highest Score</option>
            <option value="score-low">Lowest Score</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Resumes Grid */}
      {filteredAndSortedResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedResumes.filter(resume => resume && resume.id).map((resume) => (
            <div key={resume.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 truncate" title={resume.originalFileName || 'Untitled Resume'}>
                      {resume.originalFileName || 'Untitled Resume'}
                    </h3>
                  </div>
                  {resume.aiAnalysis?.score && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(resume.aiAnalysis.score)}`}>
                      {resume.aiAnalysis.score}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Analysis Status */}
                <div className="mb-4">
                  {resume.aiAnalysis ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">AI Analysis:</span>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm font-medium text-green-600">Complete</span>
                        </div>
                      </div>
                      {resume.aiAnalysis.score && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Score:</span>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-1">
                              {resume.aiAnalysis.score}/100
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(resume.aiAnalysis.score)}`}>
                              {getScoreLabel(resume.aiAnalysis.score)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">AI Analysis:</span>
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="text-sm text-orange-600">Pending</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills Preview */}
                {resume.parsedData?.skills && resume.parsedData.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {resume.parsedData.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {resume.parsedData.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{resume.parsedData.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* File Info */}
                <div className="text-xs text-gray-500 mb-4">
                  <p>Size: {resume.fileSize ? (resume.fileSize / 1024).toFixed(1) : '0'} KB</p>
                  <p>Type: {resume.mimeType ? resume.mimeType.split('/')[1]?.toUpperCase() : 'Unknown'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/resume/${resume.id}`}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Link>
                    
                    {!resume.aiAnalysis && (
                      <Link
                        to={`/resume/${resume.id}`}
                        className="flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        Analyze
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteResume(resume.id)}
                    className="flex items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          {resumes.length === 0 ? (
            <>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Resumes Found
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first resume to get started with AI-powered analysis and career suggestions.
              </p>
              <Link to="/upload-resume" className="btn-primary">
                Upload Your First Resume
              </Link>
            </>
          ) : (
            <>
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Resumes Match Your Search
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterBy('all');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
