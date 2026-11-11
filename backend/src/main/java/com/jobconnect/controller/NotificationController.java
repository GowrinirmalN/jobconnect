package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.Notification;
import com.jobconnect.entity.User;
import com.jobconnect.service.NotificationService;
import com.jobconnect.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Notifications", description = "In-app real-time notification endpoints")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationController(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get user notifications", description = "Paginated list of notifications for currently logged in user")
    public ResponseEntity<ApiResponse<PagedResponse<Notification>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User user = userService.getCurrentUser();
        Page<Notification> p = notificationService.getUserNotifications(user.getId(), PageRequest.of(page, size));
        PagedResponse<Notification> response = new PagedResponse<>(
                p.getContent(), p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages(), p.isLast()
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent 10 notifications", description = "Returns latest 10 notifications for quick notification popup")
    public ResponseEntity<ApiResponse<List<Notification>>> getRecentNotifications() {
        User user = userService.getCurrentUser();
        List<Notification> recent = notificationService.getRecentNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.success(recent));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread notifications count", description = "Returns badge count of unread notifications")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        User user = userService.getCurrentUser();
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read", description = "Acknowledge notification")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        User user = userService.getCurrentUser();
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Acknowledge all notifications")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        User user = userService.getCurrentUser();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}

