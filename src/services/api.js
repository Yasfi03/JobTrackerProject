import axios from 'axios';

// Get API URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || 'https://job-tracker-sygs.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for Render cold starts
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH API =============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// ============= JOBS API =============
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/company/my-jobs'),
};

// ============= APPLICATIONS API =============
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications?jobId=${jobId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  getApplicationsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getById: (id) => api.get(`/applications/${id}`),
  getApplicationsByJob: (jobId) => api.get(`/applications/job/${jobId}`)
};

// ============= AI API =============
export const aiAPI = {
  analyzeResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  matchJob: (applicationId) => api.post(`/ai/match-job?applicationId=${applicationId}`),
  chat: (message, jobId = null) => api.post('/ai/chat', { message, jobId }),
  getChatHistory: () => api.get('/ai/chat/history'),
  getAnalysis: (applicationId) => api.get(`/ai/analysis/${applicationId}`),
};

// ============= FILES API =============
export const filesAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============= PROFILE API =============
export const profileAPI = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};

// ============= STATS API =============
export const statsAPI = {
  getApplicantStats: () => api.get('/stats/applicant'),
  getCompanyStats: () => api.get('/stats/company'),
};

export default api;