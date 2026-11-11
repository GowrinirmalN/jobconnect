import axiosClient from './axiosClient';

export const jobService = {
  searchJobs: async (params = {}) => {
    return axiosClient.get('/jobs', { params });
  },

  getFeaturedJobs: async () => {
    return axiosClient.get('/jobs/featured');
  },

  getJobById: async (id) => {
    return axiosClient.get(`/jobs/${id}`);
  },

  createJob: async (jobData) => {
    return axiosClient.post('/jobs', jobData);
  },

  updateJob: async (id, jobData) => {
    return axiosClient.put(`/jobs/${id}`, jobData);
  },

  deleteJob: async (id) => {
    return axiosClient.delete(`/jobs/${id}`);
  },

  toggleJobStatus: async (id, status) => {
    return axiosClient.patch(`/jobs/${id}/status`, null, { params: { status } });
  },

  getRecruiterJobs: async (page = 0, size = 10) => {
    return axiosClient.get('/jobs/recruiter/my-jobs', { params: { page, size } });
  },
};

