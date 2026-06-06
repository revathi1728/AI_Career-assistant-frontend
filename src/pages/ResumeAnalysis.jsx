import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { 
  FileText, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Star,
  Target,
  Lightbulb,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchResume();
}, [id]);

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      const response = await resumeAPI.getResume(id);
      setResume(response.data.resume);
    } catch (error) {
      console.error('Error fetching resume:', error);
      setError('Failed to load resume data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      const response = await resumeAPI.analyzeResume(id);
      setResume(prev => ({
        ...prev,
        aiAnalysis: response.data.analysis
      }));
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setError('Failed to analyze resume');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReparse = async () => {
    try {
      setIsParsing(true);
      const response = await resumeAPI.parseResume(id);
      setResume(prev => ({
        ...prev,
        parsedData: response.data.parsedData || response.data.resume?.parsedData || prev.parsedData
      }));
    } catch (error) {
      console.error('Error re-parsing resume:', error);
      setError('Failed to re-parse resume');
    } finally {
      setIsParsing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error || 'Resume not found'}</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'enhancements', label: 'Enhancements', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {resume.originalFileName}
          </h1>
          <p className="text-gray-600 mt-1">
            Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {resume.aiAnalysis?.score && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {resume.aiAnalysis.score}/100
              </div>
              <div className="text-sm text-gray-500">AI Score</div>
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary flex items-center"
          >
            {isAnalyzing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {resume.aiAnalysis ? 'Re-analyze' : 'Analyze Resume'}
          </button>
          <button
            onClick={handleReparse}
            disabled={isParsing}
            className="btn-outline flex items-center"
            title="Re-parse the resume (useful if parsing failed)"
          >
            {isParsing ? 'Parsing...' : 'Re-parse'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                {resume.parsedData.personalInfo.name && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-gray-900">{resume.parsedData.personalInfo.name}</p>
                  </div>
                )}
                {resume.parsedData.personalInfo.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-900">{resume.parsedData.personalInfo.email}</p>
                  </div>
                )}
                {resume.parsedData.personalInfo.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-gray-900">{resume.parsedData.personalInfo.phone}</p>
                  </div>
                )}
                {resume.parsedData.personalInfo.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Location:</span>
                    <p className="text-gray-900">{resume.parsedData.personalInfo.location}</p>
                  </div>
                )}
                {resume.parsedData._aiParseWarning && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm text-yellow-800">{resume.parsedData._aiParseWarning}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {resume.parsedData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
              <div className="space-y-4">
                {resume.parsedData.experience?.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                    <p className="text-blue-600">{exp.company}</p>
                    {exp.duration && (
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                    )}
                    {exp.description && (
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {resume.aiAnalysis ? (
              <>
                {/* Score and Overall Feedback */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Overall Analysis</h3>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-2xl font-bold text-blue-600">
                        {resume.aiAnalysis.score}/100
                      </span>
                    </div>
                  </div>
                  {resume.aiAnalysis.overallFeedback && (
                    <p className="text-gray-700">{resume.aiAnalysis.overallFeedback}</p>
                  )}
                </div>

                {/* Strengths */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {resume.aiAnalysis.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-orange-600 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {resume.aiAnalysis.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {resume.aiAnalysis.suggestions?.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <Lightbulb className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Analysis Available
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the "Analyze Resume" button to get AI-powered insights about your resume.
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn-primary"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Analyzing...
                    </div>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'enhancements' && (
          <div className="space-y-6">
            {resume.enhancements?.length > 0 ? (
              resume.enhancements.map((enhancement, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {enhancement.type} Enhancement
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(enhancement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Original:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">{enhancement.originalText}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Enhanced:</h4>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-700">{enhancement.enhancedText}</p>
                      </div>
                    </div>
                  </div>
                  
                  {enhancement.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{enhancement.explanation}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Enhancements Yet
                </h3>
                <p className="text-gray-600">
                  Resume enhancements will appear here once you use the enhancement features.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
