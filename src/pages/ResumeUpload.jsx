import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setError('Please select a PDF, DOC, DOCX, or TXT file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      setSuccess('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await resumeAPI.uploadResume(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setSuccess('Resume uploaded and processed successfully!');
      
      // Redirect to resume analysis page after a short delay
      setTimeout(() => {
        navigate(`/resume/${response.data.resume.id}`);
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h1>
          <p className="text-gray-600">
            Upload your resume and let our AI analyze it to provide personalized career insights.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-600">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <FileText className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex items-center mx-auto text-red-600 hover:text-red-700 text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supports PDF, DOC, DOCX, and TXT files up to 5MB
                  </p>
                </div>
                <label className="btn-primary cursor-pointer inline-block">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Uploading and processing...
                </span>
                <span className="text-sm text-gray-500">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </div>
              ) : (
                'Upload and Analyze Resume'
              )}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure your resume is well-formatted and readable</li>
            <li>• Include your most recent work experience and skills</li>
            <li>• Use clear section headings (Experience, Education, Skills, etc.)</li>
            <li>• Make sure all text is selectable (not just an image)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
