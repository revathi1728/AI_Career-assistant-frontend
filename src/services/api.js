import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request:', config.method?.toUpperCase(), config.url, 'with token');
    } else {
      console.warn('No token found for API request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) =>
    api.post('/auth/register', userData),
  
  login: (credentials) =>
    api.post('/auth/login', credentials),
  adminLogin: (credentials) =>
    api.post('/auth/admin-login', credentials),
  adminSignup: (data) =>
    api.post('/auth/admin-signup', data),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  updateProfile: (profileData) =>
    api.put('/auth/profile', profileData),
};

// Resume API
export const resumeAPI = {
  uploadResume: (formData) =>
    api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getResumes: () =>
    api.get('/resume'),
  
  getResume: (id) =>
    api.get(`/resume/${id}`),
  
  analyzeResume: (id) =>
    api.post(`/resume/${id}/analyze`),

  parseResume: (id) =>
    api.post(`/resume/${id}/parse`),
  
  enhanceResume: (id, data) =>
    api.post(`/resume/${id}/enhance`, data),
  
  deleteResume: (id) =>
    api.delete(`/resume/${id}`),
};

// Career API
export const careerAPI = {
  generateSuggestions: (resumeId) =>
    api.post(`/career/generate/${resumeId}`),
  
  getSuggestions: () =>
    api.get('/career'),
  
  getSuggestion: (id) =>
    api.get(`/career/${id}`),
  
  updateSuggestion: (id, data) =>
    api.put(`/career/${id}`, data),
  
  refreshSuggestions: (id) =>
    api.post(`/career/${id}/refresh`),
  
  deleteSuggestion: (id) =>
    api.delete(`/career/${id}`),
};

// User API
export const userAPI = {
  getDashboard: () =>
    api.get('/user/dashboard'),
  
  getStats: () =>
    api.get('/user/stats'),
  
  updatePreferences: (preferences) =>
    api.put('/user/preferences', { preferences }),
  
  updateProfile: (profileData) =>
    api.put('/user/profile', profileData),
  
  getActivity: (page = 1, limit = 20) =>
    api.get(`/user/activity?page=${page}&limit=${limit}`),
  
  exportData: () =>
    api.get('/user/export'),
};

export default api;
