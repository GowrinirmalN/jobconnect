package com.jobconnect.service;

import com.jobconnect.dto.*;
import com.jobconnect.entity.RoleName;

public interface AdminService {
    AdminStatsDto getDashboardStats();
    PagedResponse<UserManagementDto> getAllUsers(String keyword, RoleName roleName, int page, int size);
    UserManagementDto toggleUserStatus(Long userId, boolean active);
    void deleteUser(Long userId);
    PagedResponse<JobResponseDto> getAllJobs(int page, int size);
    void deleteJobByAdmin(Long jobId);
    PagedResponse<ApplicationResponseDto> getAllApplications(int page, int size);
}

