package com.jobconnect.controller;

import com.jobconnect.dto.*;
import com.jobconnect.entity.RoleName;
import com.jobconnect.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administration and platform governance endpoints")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform metrics", description = "Aggregated counts of users, jobs, applications, and breakdown by status")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getDashboardStats() {
        AdminStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Search, filter by role, and paginate all platform users")
    public ResponseEntity<ApiResponse<PagedResponse<UserManagementDto>>> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) RoleName role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<UserManagementDto> response = adminService.getAllUsers(keyword, role, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activate or deactivate user account", description = "Toggle active state for any user")
    public ResponseEntity<ApiResponse<UserManagementDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active
    ) {
        UserManagementDto user = adminService.toggleUserStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("User status updated", user));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Remove user account from system")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all platform jobs", description = "Paginated list of all jobs across all recruiters for moderation")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobResponseDto> response = adminService.getAllJobs(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Moderate job posting", description = "Admin can remove inappropriate or spam job postings")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        adminService.deleteJobByAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Job posting removed by Admin", null));
    }

    @GetMapping("/applications")
    @Operation(summary = "Get all platform applications", description = "Auditing view of all applications across all jobs")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ApplicationResponseDto> response = adminService.getAllApplications(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

