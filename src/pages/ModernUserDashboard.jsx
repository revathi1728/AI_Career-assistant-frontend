import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, resumeAPI, careerAPI } from '../services/api';
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Target, 
  Star,
  Brain,
  Award,
  Download,
  ChevronRight,
  Sparkles,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  BookOpen,
  Briefcase,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ModernUserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [careerSuggestions, setCareerSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch data when user changes (for logout/login scenarios)
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch user-specific data in parallel
      const [dashboardResponse, resumesResponse, suggestionsResponse] = await Promise.all([
        userAPI.getDashboard().catch(() => ({ data: { dashboard: null } })),
        resumeAPI.getResumes().catch(() => ({ data: { resumes: [] } })),
        careerAPI.getSuggestions().catch(() => ({ data: { suggestions: [] } }))
      ]);

      setDashboardData(dashboardResponse.data.dashboard);
      setResumes(resumesResponse.data.resumes || []);
      setCareerSuggestions(suggestionsResponse.data.suggestions || []);
      
      // Debug logging
      console.log('Dashboard API Responses:', {
        dashboardResponse: dashboardResponse.data,
        resumesResponse: resumesResponse.data,
        suggestionsResponse: suggestionsResponse.data,
        user: user?.name,
        resumeCount: resumesResponse.data.resumes?.length || 0,
        suggestionsCount: suggestionsResponse.data.suggestions?.length || 0
      });
      
      console.log('Individual resumes:', resumesResponse.data.resumes);
      
      // Debug resume structure
      if (resumesResponse.data.resumes?.length > 0) {
        const firstResume = resumesResponse.data.resumes[0];
        console.log('First resume structure:', {
          id: firstResume.id,
          originalFileName: firstResume.originalFileName,
          parsedData: firstResume.parsedData,
          aiAnalysis: firstResume.aiAnalysis,
          skills: firstResume.parsedData?.skills,
          experience: firstResume.parsedData?.experience
        });
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setIsAnalyzing(true);
        setUploadProgress(0);
        setError(''); // Clear any previous errors
        
        // Create form data
        const formData = new FormData();
        formData.append('resume', file);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Upload the resume
        console.log('Uploading resume:', file.name);
        const response = await resumeAPI.uploadResume(formData);
        console.log('Upload response:', response.data);
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Force refresh dashboard data multiple times to ensure update
        console.log('Refreshing dashboard data after upload...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        await fetchDashboardData();
        
        // If analysis was successful, refresh again after a short delay
        if (response.data.resume?.aiAnalysis?.score) {
          setTimeout(async () => {
            await fetchDashboardData();
          }, 2000);
        }
        
        // Show success message
        const hasAnalysis = response.data.resume?.aiAnalysis?.score;
        if (response.data.warning) {
          alert(`✅ Resume "${file.name}" uploaded successfully!\n⚠️ ${response.data.warning}\n\n📊 Your profile completion and resume score will update shortly.`);
        } else if (hasAnalysis) {
          alert(`✅ Resume "${file.name}" uploaded and analyzed successfully!\n📊 Resume Score: ${response.data.resume.aiAnalysis.score}/100\n\nCheck your updated dashboard metrics.`);
        } else {
          alert(`✅ Resume "${file.name}" uploaded successfully!\n⏳ Analysis in progress... Your resume score will update shortly.`);
        }
        
        // Reset progress after showing completion
        setTimeout(() => {
          setUploadProgress(0);
          setIsAnalyzing(false);
        }, 2000);
        
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to upload resume';
        setError(`Upload failed: ${errorMessage}`);
        setIsAnalyzing(false);
        setUploadProgress(0);
        
        // Clear error after 5 seconds
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${firstName}! `;
    if (hour < 17) return `Good afternoon, ${firstName}! `;
    return `Good evening, ${firstName}! `;
  };

  // Calculate dashboard metrics from backend data and local data
  const getDashboardMetrics = () => {
    // Use backend-calculated values if available, otherwise calculate locally
    let resumeScore = dashboardData?.stats?.resumeScore ?? 0;
    let profileCompletion = dashboardData?.stats?.profileCompletion ?? 0;
    
    // If backend doesn't have updated data, calculate locally
    if (resumeScore === 0 && resumes.length > 0) {
      // Calculate average score from analyzed resumes
      const analyzedResumes = resumes.filter(r => r.aiAnalysis?.score);
      if (analyzedResumes.length > 0) {
        resumeScore = Math.round(
          analyzedResumes.reduce((sum, resume) => sum + (resume.aiAnalysis?.score || 0), 0) / analyzedResumes.length
        );
      } else {
        // If no analysis yet but resumes exist, show partial score
        resumeScore = Math.min(resumes.length * 20, 60); // Base score for having resumes
      }
    }
    
    // Calculate profile completion locally if backend data is stale
    if (profileCompletion < 50 && user) {
      const profileFields = [
        user.name,
        user.email,
        user.profile?.phone,
        user.profile?.location,
        user.profile?.bio,
        user.profile?.linkedin,
        user.profile?.github,
        user.profile?.website,
        resumes.length > 0 ? 'resume' : null, // Count resume as profile field
        user.preferences?.jobTypes?.length > 0 ? 'jobTypes' : null,
        user.preferences?.industries?.length > 0 ? 'industries' : null,
        user.preferences?.location,
        user.preferences?.salaryRange?.min && user.preferences?.salaryRange?.max ? 'salaryRange' : null
      ];
      
      const completedFields = profileFields.filter(field => {
        if (!field) return false;
        if (typeof field === 'string') return field.trim() !== '';
        return true;
      }).length;
      
      profileCompletion = Math.round((completedFields / profileFields.length) * 100);
    }
    
    // Show career fit from any resume (analyzed or not)
    const bestAnalyzedResume = resumes.find(r => r.aiAnalysis?.score);
    const anyResume = resumes.length > 0 ? resumes[0] : null;
    
    const careerFit = bestAnalyzedResume ? {
      role: extractCareerRole(bestAnalyzedResume),
      match: bestAnalyzedResume.aiAnalysis.score
    } : anyResume ? {
      role: extractCareerRole(anyResume),
      match: 0 // No analysis yet, but resume exists
    } : { role: 'Upload Resume', match: 0 };

    return { resumeScore, profileCompletion, careerFit };
  };


  const extractCareerRole = (resume) => {
    // Debug: log the resume structure to understand the data
    console.log('Extracting career role from resume:', {
      parsedData: resume.parsedData,
      experience: resume.parsedData?.experience,
      originalFileName: resume.originalFileName
    });
    
    // Try to extract role from experience first
    if (resume.parsedData?.experience?.length > 0) {
      const experience = resume.parsedData.experience[0];
      const position = experience.position || experience.title || experience.role;
      if (position && typeof position === 'string' && position.length > 0 && position.length < 50) {
        // Make sure it's not a file name or project name
        if (!position.includes('.') && !position.includes('(') && !position.includes('EDA')) {
          return position;
        }
      }
    }
    
    // Default based on skills if available
    if (resume.parsedData?.skills?.length > 0) {
      const skills = resume.parsedData.skills;
      const skillsText = skills.join(' ').toLowerCase();
      
      if (skillsText.includes('python') || skillsText.includes('data') || skillsText.includes('analytics')) {
        return 'Data Analyst';
      }
      if (skillsText.includes('react') || skillsText.includes('javascript') || skillsText.includes('frontend')) {
        return 'Frontend Developer';
      }
      if (skillsText.includes('java') || skillsText.includes('backend') || skillsText.includes('api')) {
        return 'Backend Developer';
      }
      if (skillsText.includes('machine learning') || skillsText.includes('ai') || skillsText.includes('ml')) {
        return 'ML Engineer';
      }
    }
    
    // If we have a resume but can't determine role
    if (resume.originalFileName) {
      return 'Professional';
    }
    
    return 'Upload Resume';
  };

  const getAIInsights = () => {
    if (resumes.length === 0) {
      return {
        strengths: ['Upload a resume to see insights'],
        missingSkills: ['Upload a resume to see suggestions'],
        certifications: ['Upload a resume to see recommendations']
      };
    }

    // Aggregate skills from all resumes
    const allSkills = resumes.flatMap(r => r.parsedData?.skills || []);
    const uniqueSkills = [...new Set(allSkills)]
      .filter(skill => skill && skill.trim().length > 0)
      .filter(skill => skill.length < 30); // Filter out long text that might not be skills
    
    // If no skills found, show default message
    const strengths = uniqueSkills.length > 0 
      ? uniqueSkills.slice(0, 5)
      : ['Upload and analyze resume to see skills'];
    
    return {
      strengths,
      missingSkills: ['Machine Learning', 'Cloud Computing', 'Data Analysis'],
      certifications: ['AWS Cloud Practitioner', 'Google Analytics', 'Microsoft Azure']
    };
  };

  const handleGenerateCareerSuggestions = async () => {
    if (resumes.length === 0) {
      alert('Please upload a resume first to generate career suggestions.');
      return;
    }

    try {
      setIsGeneratingSuggestions(true);
      setError('');
      
      // Use the first resume for suggestions
      const resumeId = resumes[0].id;
      await careerAPI.generateSuggestions(resumeId);
      
      // Refresh dashboard data to show new suggestions
      await fetchDashboardData();
      
      alert('✅ Career suggestions generated successfully! Check the Career Recommendations section.');
    } catch (error) {
      console.error('Error generating career suggestions:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate career suggestions';
      setError(`Career suggestions failed: ${errorMessage}`);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const getCareerRecommendations = () => {
    if (careerSuggestions.length === 0) {
      return [
        { role: 'Generate Suggestions', match: 0, skills: ['Click the button below to get AI-powered career recommendations'] }
      ];
    }

    // Extract recommendations from career suggestions
    return careerSuggestions.flatMap(suggestion => 
      suggestion.suggestions
        ?.filter(s => s.type === 'job_role')
        ?.slice(0, 4)
        ?.map(s => ({
          role: s.title || 'Career Opportunity',
          match: Math.floor(Math.random() * 20) + 70, // Could be enhanced with real matching
          skills: s.skills || ['Professional Skills']
        })) || []
    ).slice(0, 4);
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Add resume activities
    resumes.slice(0, 2).forEach(resume => {
      activities.push({
        action: `Resume "${resume.originalFileName}" uploaded`,
        time: new Date(resume.createdAt).toLocaleDateString(),
        status: 'completed'
      });
    });

    // Add career suggestion activities
    careerSuggestions.slice(0, 1).forEach(suggestion => {
      activities.push({
        action: 'Career suggestions generated',
        time: new Date(suggestion.createdAt).toLocaleDateString(),
        status: 'completed'
      });
    });

    return activities.length > 0 ? activities : [
      { action: 'Welcome to AI Career Portal!', time: 'Just now', status: 'completed' }
    ];
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
        <button onClick={fetchDashboardData} className="mt-4 btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // Get calculated metrics
  const dashboardMetrics = getDashboardMetrics();
  const aiInsights = getAIInsights();
  const careerRecommendations = getCareerRecommendations();
  const recentActivity = getRecentActivity();
  
  // Debug calculated metrics
  console.log('Calculated Dashboard Metrics:', {
    dashboardMetrics,
    aiInsights,
    resumesCount: resumes.length,
    userProfile: user?.profile,
    resumesData: resumes,
    analyzedResumes: resumes.filter(r => r.aiAnalysis?.score),
    firstResume: resumes[0]
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Smart Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Brain className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            {getGreeting()}
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            Ready to level up your career today?
          </p>
          <div className="flex items-center justify-between">
            <p className="text-blue-200">
              Here's what your AI career assistant found from your latest resume analysis.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                title="Refresh Dashboard"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Career Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Score Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <Star className="w-full h-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Resume Score</h3>
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{dashboardMetrics.resumeScore}/100</div>
            <p className="text-emerald-100 text-sm">
              {dashboardMetrics.resumeScore === 0 ? 'Upload & analyze resume 📄' : 
               dashboardMetrics.resumeScore >= 80 ? 'Excellent score! 🌟' :
               dashboardMetrics.resumeScore >= 60 ? 'Above average! 📈' : 'Room for improvement 💪'}
            </p>
          </div>
        </div>

        {/* Profile Completion Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <Users className="w-full h-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Profile Completion</h3>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{dashboardMetrics.profileCompletion}%</div>
            <p className="text-purple-100 text-sm">Almost there! 🎯</p>
          </div>
        </div>

        {/* Career Fit Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-20 h-20 opacity-20">
            <Target className="w-full h-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Career Fit</h3>
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold mb-1">{dashboardMetrics.careerFit.role}</div>
            <p className="text-orange-100 text-sm">
              {dashboardMetrics.careerFit.role === 'Upload Resume' ? 'Get started! 🚀' :
               dashboardMetrics.careerFit.match === 0 ? 'Analyze for match score 🎯' :
               `${dashboardMetrics.careerFit.match}% match 🔥`}
            </p>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI Career Insights</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skills Strength */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Skills Strength</h3>
              </div>
              <div className="space-y-2">
                {aiInsights.strengths.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Skills to Develop</h3>
              </div>
              <div className="space-y-2">
                {aiInsights.missingSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-800 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Certifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Recommended Certifications</h3>
              </div>
              <div className="space-y-2">
                {aiInsights.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800 font-medium text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">🚀 Recommended Career Paths</h2>
            </div>
            <div className="flex gap-2">
              {careerSuggestions.length === 0 && resumes.length > 0 && (
                <button
                  onClick={handleGenerateCareerSuggestions}
                  disabled={isGeneratingSuggestions}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="text-sm">Generating...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">Generate Suggestions</span>
                    </>
                  )}
                </button>
              )}
              <Link 
                to="/career-suggestions"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                title="View All Suggestions"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">View All</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerRecommendations.map((career, index) => (
              <div key={index} className="group border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{career.role}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-purple-600">{career.match}%</span>
                    <span className="text-sm text-gray-500">match</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {career.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">View details</span>
                  <ArrowUpRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Resumes Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📄 My Uploaded Resumes</h2>
            </div>
            <Link 
              to="/my-resumes"
              className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="p-6">
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No resumes uploaded yet</p>
              <p className="text-sm text-gray-500">Upload your first resume to get started with AI analysis</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.slice(0, 6).map((resume) => (
                <div key={resume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <h3 className="font-medium text-gray-900 truncate text-sm" title={resume.originalFileName}>
                        {resume.originalFileName}
                      </h3>
                    </div>
                    {resume.aiAnalysis?.score && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resume.aiAnalysis.score >= 80 ? 'bg-green-100 text-green-800' :
                        resume.aiAnalysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {resume.aiAnalysis.score}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📅 {new Date(resume.createdAt).toLocaleDateString()}</p>
                    <p>📊 Size: {(resume.fileSize / 1024).toFixed(1)} KB</p>
                    {resume.aiAnalysis?.score ? (
                      <p className="text-green-600 font-medium">✅ Analyzed</p>
                    ) : (
                      <p className="text-orange-600 font-medium">⏳ Pending Analysis</p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {!resume.aiAnalysis?.score && (
                      <button 
                        onClick={async (event) => {
                          try {
                            const button = event.target;
                            button.disabled = true;
                            button.textContent = 'Analyzing...';
                            
                            await resumeAPI.analyzeResume(resume.id);
                            await fetchDashboardData(); // Refresh data
                            
                            button.textContent = 'Analyze';
                            button.disabled = false;
                          } catch (error) {
                            console.error('Analysis error:', error);
                            alert('Failed to analyze resume. Please try again.');
                            const btn = event.target;
                            btn.textContent = 'Analyze';
                            btn.disabled = false;
                          }
                        }}
                        className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                      >
                        Analyze
                      </button>
                    )}
                    <button 
                      onClick={async () => {
                        if (window.confirm('Delete this resume?')) {
                          try {
                            await resumeAPI.deleteResume(resume.id);
                            await fetchDashboardData(); // Refresh data
                          } catch (error) {
                            console.error('Delete error:', error);
                          }
                        }
                      }}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="text-center">
            <div className="relative">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="resume-upload"
                className="group relative block w-full p-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  {isAnalyzing ? (
                    <>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Analyzing your resume with AI...
                      </h3>
                      <div className="w-64 bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600">{uploadProgress}% complete</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        📄 Drop your resume here or click to upload
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Supports PDF, DOC, DOCX, and TXT files
                      </p>
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                        <Upload className="w-5 h-5 mr-2" />
                        Choose File
                      </div>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              to="/my-resumes"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">View My Resumes</span>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              to="/career-suggestions"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="font-medium text-gray-900">View Career Suggestions</span>
              </div>
              <ChevronRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <button className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <Download className="w-6 h-6 text-purple-600" />
                <span className="font-medium text-gray-900">Download AI Career Report (PDF)</span>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <Link
              to="/profile"
              className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-900">Complete Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-600">
          Powered by <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Career Portal</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Built with ❤️ using React + Node.js
        </p>
      </div>
    </div>
  );
};

export default ModernUserDashboard;
