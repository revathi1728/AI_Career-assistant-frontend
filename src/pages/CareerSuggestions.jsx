import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerAPI, resumeAPI } from '../services/api';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Briefcase,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  RefreshCw,
  Plus,
  FileText
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const CareerSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [careerPath, setCareerPath] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [industryInsights, setIndustryInsights] = useState({});
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const [suggestionsResponse, resumesResponse] = await Promise.all([
        careerAPI.getSuggestions().catch(() => ({ data: { suggestions: [] } })),
        resumeAPI.getResumes().catch(() => ({ data: { resumes: [] } }))
      ]);
      
      // If suggestions list is not empty, extract top-level fields from the first suggestion record
      const suggestionList = suggestionsResponse.data.suggestions || [];
      const extractedSuggestions = suggestionList.length > 0 ? suggestionList[0].suggestions : [];
      console.log('DEBUG suggestions:', extractedSuggestions);
      setSuggestions(extractedSuggestions);
      setCareerPath(suggestionList.length > 0 ? suggestionList[0].careerPath || [] : []);
      setSkillGaps(suggestionList.length > 0 ? suggestionList[0].skillGaps || [] : []);
      setIndustryInsights(suggestionList.length > 0 ? suggestionList[0].industryInsights || {} : {});
      setResumes(resumesResponse.data.resumes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load career suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (suggestionId) => {
    try {
      await careerAPI.refreshSuggestions(suggestionId);
      fetchSuggestions(); // Refresh the list
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      setError('Failed to refresh suggestions');
    }
  };

  const handleGenerateSuggestions = async (resumeId) => {
    try {
      setIsGenerating(true);
      setError('');
      const response = await careerAPI.generateSuggestions(resumeId);
      
      if (response.data && response.data.message) {
        // If we get a success message, fetch the updated suggestions
        await fetchSuggestions();
      } else {
        // If no data or message, show a success message and refresh
        setError('');
        await fetchSuggestions();
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setError(error.response?.data?.message || 'Failed to generate career suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job_role': return <Briefcase className="w-5 h-5" />;
      case 'skill_development': return <BookOpen className="w-5 h-5" />;
      case 'certification': return <Target className="w-5 h-5" />;
      case 'education': return <BookOpen className="w-5 h-5" />;
      case 'career_path': return <TrendingUp className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
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
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchSuggestions} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // Split suggestions by type for easy rendering
  const jobRoles = suggestions.filter(s => s.type === 'job_role');
  const skillSuggestions = suggestions.filter(s => s.type === 'skill_development');
  const certificationSuggestions = suggestions.filter(s => s.type === 'certification');

  return (
    <>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Career Suggestions</h1>
          <p className="text-gray-600 mt-1">
            AI-powered career recommendations based on your resume analysis
          </p>
        </div>
        <Link to="/upload-resume" className="btn-primary">
          Upload New Resume
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'all', label: 'All Suggestions' },
            { id: 'job_role', label: 'Job Roles' },
            { id: 'skill_development', label: 'Skills' },
            { id: 'certification', label: 'Certifications' },
            { id: 'career_path', label: 'Career Paths' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Job Roles Section */}
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Job Roles</h2>
          {jobRoles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobRoles.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="text-xs text-gray-500 mb-2">Est. Time: {item.estimatedTime}</div>
                  <div className="text-xs text-gray-500 mb-2">Salary: ${item.salaryRange?.min?.toLocaleString()} - ${item.salaryRange?.max?.toLocaleString()}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.skills?.map((skill, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>)}
                  </div>
                  {item.resources?.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-xs mb-1">Resources:</div>
                      {item.resources.slice(0,2).map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs block">{res.title}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="text-gray-500">No job roles found.</div>}
        </div>

        {/* Skills Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2" /> Skills to Improve</h2>
          {skillSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillSuggestions.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.skills?.map((skill, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>)}
                  </div>
                  {item.resources?.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-xs mb-1">Resources:</div>
                      {item.resources.slice(0,2).map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs block">{res.title}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="text-gray-500">No skill suggestions found.</div>}
        </div>

        {/* Certifications Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Target className="w-5 h-5 mr-2" /> Certifications</h2>
          {certificationSuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificationSuggestions.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">{item.title}</h5>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.skills?.map((skill, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{skill}</span>)}
                  </div>
                  {item.resources?.length > 0 && (
                    <div className="mt-2">
                      <div className="font-medium text-xs mb-1">Resources:</div>
                      {item.resources.slice(0,2).map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs block">{res.title}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <div className="text-gray-500">No certifications found.</div>}
        </div>

        {/* Career Path Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2" /> Career Path</h2>
          {careerPath.length > 0 ? (
            <div className="space-y-3">
              {careerPath.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{step.title}</h5>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    {step.timeline && (
                      <p className="text-blue-600 text-sm mt-1">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {step.timeline}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : <div className="text-gray-500">No career path found.</div>}
        </div>
      </div>
          <div className="space-y-6">
              {/* No suggestions but have resumes */}
              {resumes.length > 0 ? (
                <div className="card">
                  <div className="text-center py-12 px-4">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-6">
                      <TrendingUp className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Unlock Your Career Potential
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                      Get personalized AI-powered career suggestions based on your resume.
                      Our analysis will help you discover new opportunities and skills to develop.
                    </p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-8">
                      <h3 className="font-semibold text-blue-800 mb-3">What you'll get:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
                        {[
                          {
                            icon: <Briefcase className="w-5 h-5 text-blue-600" />,
                            title: 'Job Matches',
                            description: 'Discover roles that match your skills'
                          },
                          {
                            icon: <BookOpen className="w-5 h-5 text-green-600" />,
                            title: 'Skill Development',
                            description: 'Identify key skills to develop'
                          },
                          {
                            icon: <Target className="w-5 h-5 text-purple-600" />,
                            title: 'Career Path',
                            description: 'See your potential career progression'
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg">
                            <div className="flex-shrink-0 mt-0.5">
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-8 px-6 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                      Select a resume to generate suggestions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                      {resumes.map((resume) => (
                        <div 
                          key={resume.id} 
                          className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 break-words">
                                  {resume.originalFileName}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {resume.aiAnalysis?.score && (
                              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Score: {resume.aiAnalysis.score}/100
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleGenerateSuggestions(resume.id)}
                            disabled={isGenerating}
                            className={`w-full mt-4 btn-primary flex items-center justify-center ${
                              isGenerating ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                            }`}
                          >
                            {isGenerating ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Generate Suggestions
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <Link 
                        to="/upload-resume" 
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Upload a different resume
                      </Link>
                    </div>
                  </div>
                </div>
            ) : (
              /* No resumes at all */
              <div className="card text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Resumes Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Upload your resume first to get personalized AI-powered career suggestions.
                </p>
                <Link to="/upload-resume" className="btn-primary">
                  Upload Your First Resume
                </Link>
              </div>
            )}
          </div>
      </div>
    </>
  );
};

export default CareerSuggestions;
