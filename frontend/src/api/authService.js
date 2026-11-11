import axiosClient from './axiosClient';

export const authService = {
  login: async (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },

  register: async (payload) => {
    return axiosClient.post('/auth/register', payload);
  },
};

