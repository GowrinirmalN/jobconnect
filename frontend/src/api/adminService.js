import axiosClient from './axiosClient';

export const adminService = {
  getDashboardStats: async () => {
    return axiosClient.get('/admin/dashboard');
  },

  getUsers: async (keyword = '', role = null, page = 0, size = 10) => {
    return axiosClient.get('/admin/users', {
      params: { keyword, role, page, size },
    });
  },

  toggleUserStatus: async (userId, active) => {
    return axiosClient.patch(`/admin/users/${userId}/status`, null, {
      params: { active },
    });
  },

  deleteUser: async (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  getJobs: async (page = 0, size = 10) => {
    return axiosClient.get('/admin/jobs', { params: { page, size } });
  },

  deleteJob: async (jobId) => {
    return axiosClient.delete(`/admin/jobs/${jobId}`);
  },

  getApplications: async (page = 0, size = 10) => {
    return axiosClient.get('/admin/applications', { params: { page, size } });
  },
};

