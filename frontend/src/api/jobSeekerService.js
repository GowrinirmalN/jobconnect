import axiosClient from './axiosClient';

export const jobSeekerService = {
  getProfile: async () => {
    return axiosClient.get('/jobseekers/profile');
  },

  updateProfile: async (profileData) => {
    return axiosClient.put('/jobseekers/profile', profileData);
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/jobseekers/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getResumes: async () => {
    return axiosClient.get('/jobseekers/resumes');
  },

  getSeekerById: async (id) => {
    return axiosClient.get(`/jobseekers/${id}`);
  },
};

