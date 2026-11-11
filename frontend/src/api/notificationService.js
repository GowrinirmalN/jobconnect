import axiosClient from './axiosClient';

export const notificationService = {
  getNotifications: async (page = 0, size = 10) => {
    return axiosClient.get('/notifications', { params: { page, size } });
  },

  getRecentNotifications: async () => {
    return axiosClient.get('/notifications/recent');
  },

  getUnreadCount: async () => {
    return axiosClient.get('/notifications/unread-count');
  },

  markAsRead: async (id) => {
    return axiosClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return axiosClient.patch('/notifications/read-all');
  },
};

