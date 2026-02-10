import axios from 'axios';
import { dummyUsers, dummyJobs, dummyApplications } from '../data/dummyData';

// Change this to your backend URL when ready
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Using dummy data for now
const USE_DUMMY_DATA = true;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  login: async (credentials) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      
      const user = Object.values(dummyUsers).find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        return { data: { ...user, token: 'dummy-token-' + Date.now() } };
      } else {
        throw new Error('Invalid credentials');
      }
    }
    // When backend is ready, uncomment:
    // return api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      return { 
        data: { 
          ...userData, 
          token: 'dummy-token-' + Date.now() 
        } 
      };
    }
    // When backend is ready, uncomment:
    // return api.post('/auth/register', userData);
  }
};

export const jobAPI = {
  getAll: async () => {
    if (USE_DUMMY_DATA) {
      await delay(300);
      return { data: dummyJobs };
    }
    // return api.get('/jobs');
  },

  getById: async (id) => {
    if (USE_DUMMY_DATA) {
      await delay(300);
      const job = dummyJobs.find(j => j.id === parseInt(id));
      return { data: job };
    }
    // return api.get(`/jobs/${id}`);
  },

  create: async (jobData) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      return { 
        data: { 
          id: Date.now(), 
          ...jobData, 
          postedDate: new Date().toISOString().split('T')[0],
          applicants: 0
        } 
      };
    }
    // return api.post('/jobs', jobData);
  }
};

export const applicationAPI = {
  getMyApplications: async () => {
    if (USE_DUMMY_DATA) {
      await delay(300);
      return { data: dummyApplications };
    }
    // return api.get('/applications/me');
  },

  apply: async (jobId, applicationData) => {
    if (USE_DUMMY_DATA) {
      await delay(500);
      return { 
        data: { 
          id: Date.now(), 
          jobId,
          ...applicationData,
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Applied'
        } 
      };
    }
    // return api.post(`/applications/${jobId}`, applicationData);
  }
};

export default api;