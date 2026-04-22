import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Target,
  Zap
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-600" />,
      title: "Smart Resume Upload",
      description: "Upload your resume in PDF, DOC, or DOCX format and let our AI extract and analyze your information."
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "AI-Powered Analysis",
      description: "Get detailed feedback on your resume with strengths, weaknesses, and improvement suggestions."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Career Suggestions",
      description: "Receive personalized career recommendations based on your skills and experience."
    },
    {
      icon: <Target className="w-8 h-8 text-red-600" />,
      title: "Skill Gap Analysis",
      description: "Identify missing skills and get a roadmap to bridge the gaps in your career."
    }
  ];

  const benefits = [
    "ATS-optimized resume suggestions",
    "Industry-specific career paths",
    "Real-time job market insights",
    "Personalized learning recommendations",
    "Salary range predictions",
    "Interview preparation tips"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-[0_8px_30px_rgba(2,6,23,0.6)]">
            Supercharge Your Career with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95 text-white/85 drop-shadow-sm">
            Upload your resume and get AI-powered insights, career suggestions, and personalized recommendations to advance your professional journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-[1.02]"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white/90 bg-white/10 hover:bg-white/20 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Advance Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive career assistance to help you reach your professional goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our AI Career Portal?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Get personalized insights and recommendations that are tailored specifically to your career goals and industry.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Resume Analysis Report
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Score</span>
                    <span className="text-2xl font-bold text-green-600">85/100</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Quality</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ATS Optimization</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Keyword Density</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of professionals who have already enhanced their careers with our AI-powered platform.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            Start Your Journey Today
            <Zap className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
