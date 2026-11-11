import axiosClient from './axiosClient';

export const applicationService = {
  applyForJob: async (jobId, coverLetter = '', resumeUrl = null) => {
    return axiosClient.post('/applications/apply', { jobId, coverLetter, resumeUrl });
  },

  getMyApplications: async (page = 0, size = 10) => {
    return axiosClient.get('/applications/my-applications', { params: { page, size } });
  },

  getRecruiterApplications: async (jobId = null, status = null, page = 0, size = 10) => {
    return axiosClient.get('/applications/recruiter', {
      params: { jobId, status, page, size },
    });
  },

  getApplicationById: async (id) => {
    return axiosClient.get(`/applications/${id}`);
  },

  updateApplicationStatus: async (id, status, notes = '') => {
    return axiosClient.patch(`/applications/${id}/status`, { status, notes });
  },
};

