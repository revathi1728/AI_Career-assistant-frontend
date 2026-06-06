import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {  
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe,
  Save,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    profile: {
      phone: '',
      location: '',
      bio: '',
      linkedin: '',
      github: '',
      website: ''
    },
    preferences: {
      jobTypes: [],
      industries: [],
      salaryRange: {
        min: '',
        max: ''
      },
      location: '',
      remoteWork: false
    }
  });
  const [isLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        profile: {
          phone: user.profile?.phone || '',
          location: user.profile?.location || '',
          bio: user.profile?.bio || '',
          linkedin: user.profile?.linkedin || '',
          github: user.profile?.github || '',
          website: user.profile?.website || ''
        },
        preferences: {
          jobTypes: user.preferences?.jobTypes || [],
          industries: user.preferences?.industries || [],
          salaryRange: {
            min: user.preferences?.salaryRange?.min || '',
            max: user.preferences?.salaryRange?.max || ''
          },
          location: user.preferences?.location || '',
          remoteWork: user.preferences?.remoteWork || false
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value,checked } = e.target;
    
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value
        }
      }));
    } else if (name.startsWith('preferences.')) {
      const field = name.split('.')[1];
      if (field === 'remoteWork') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [field]: checked
          }
        }));
      } else if (field === 'salaryRange.min' || field === 'salaryRange.max') {
        const rangeField = field.split('.')[1];
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            salaryRange: {
              ...prev.preferences.salaryRange,
              [rangeField]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [field]: value
          }
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Media',
    'Non-profit',
    'Government'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile information and career preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
            {/* --- First Row: Name, Email, Phone, Location --- */}
            <div className="col-span-2">
              <label className="label font-medium text-gray-700 mb-1 block">Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="input-field bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
            </div>
            <div className="col-span-2">
              <label className="label font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="md:col-span-2 flex flex-col md:flex-row md:gap-x-24">
              <div className="flex-1">
                <label className="label font-medium text-gray-700 mb-1 block">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="profile.phone"
                    value={formData.profile.phone}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="label font-medium text-gray-700 mb-1 block">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="profile.location"
                    value={formData.profile.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your location"
                  />
                </div>
              </div>
            </div>
            {/* --- Bio Row --- */}
            <div className="col-span-2 md:col-span-4">
              <label className="label font-medium text-gray-700 mb-1 block">Bio</label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>
            {/* --- Add vertical gap before social links --- */}
            <div className="col-span-4 h-2 md:h-4"></div>
            {/* --- Social Links Row --- */}
            <div className="col-span-4 flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-4">
              <div className="flex-1">
                <label className="label font-medium text-gray-700 mb-1 block">LinkedIn</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="profile.linkedin"
                    value={formData.profile.linkedin}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="label font-medium text-gray-700 mb-1 block">GitHub</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="profile.github"
                    value={formData.profile.github}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="label font-medium text-gray-700 mb-1 block">Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="profile.website"
                    value={formData.profile.website}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Preferences */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Career Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Preferred Job Types</label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.jobTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              jobTypes: [...prev.preferences.jobTypes, type]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              jobTypes: prev.preferences.jobTypes.filter(t => t !== type)
                            }
                          }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Industries of Interest</label>
              <div className="space-y-2">
                {industries.map((industry) => (
                  <label key={industry} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.industries.includes(industry)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              industries: [...prev.preferences.industries, industry]
                            }
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              industries: prev.preferences.industries.filter(i => i !== industry)
                            }
                          }));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="label">Preferred Location</label>
              <input
                type="text"
                name="preferences.location"
                value={formData.preferences.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter preferred location"
              />
            </div>

            <div>
              <label className="label">Minimum Salary</label>
              <input
                type="number"
                name="preferences.salaryRange.min"
                value={formData.preferences.salaryRange.min}
                onChange={handleChange}
                className="input-field"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="label">Maximum Salary</label>
              <input
                type="number"
                name="preferences.salaryRange.max"
                value={formData.preferences.salaryRange.max}
                onChange={handleChange}
                className="input-field"
                placeholder="100000"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="preferences.remoteWork"
                checked={formData.preferences.remoteWork}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Open to remote work</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
