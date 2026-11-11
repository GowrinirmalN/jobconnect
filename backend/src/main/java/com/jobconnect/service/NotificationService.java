package com.jobconnect.service;

import com.jobconnect.entity.Notification;
import com.jobconnect.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String title, String message, String type);
    Page<Notification> getUserNotifications(Long userId, Pageable pageable);
    List<Notification> getRecentNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}

