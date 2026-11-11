import axiosClient from './axiosClient';

export const recruiterService = {
  getProfile: async () => {
    return axiosClient.get('/recruiters/profile');
  },

  updateProfile: async (profileData) => {
    return axiosClient.put('/recruiters/profile', profileData);
  },

  getDashboardStats: async () => {
    return axiosClient.get('/recruiters/dashboard');
  },

  getRecruiterById: async (id) => {
    return axiosClient.get(`/recruiters/${id}`);
  },
};

