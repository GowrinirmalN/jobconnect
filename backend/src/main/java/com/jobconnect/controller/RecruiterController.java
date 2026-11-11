package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.RecruiterProfileDto;
import com.jobconnect.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recruiters")
@Tag(name = "Recruiters", description = "Recruiter profile, company branding, and analytics endpoints")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get recruiter company profile", description = "Retrieve company info, website, logo, and recruiter details")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> getCurrentProfile() {
        RecruiterProfileDto profile = recruiterService.getCurrentProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Update recruiter profile", description = "Update company details, branding and location")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> updateProfile(@Valid @RequestBody RecruiterProfileDto profileDto) {
        RecruiterProfileDto updated = recruiterService.updateProfile(profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get recruiter dashboard metrics", description = "Summary statistics of posted jobs and applicants pipeline")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = recruiterService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get recruiter info by ID", description = "Public or authenticated view of company recruiter")
    public ResponseEntity<ApiResponse<RecruiterProfileDto>> getProfileById(@PathVariable Long id) {
        RecruiterProfileDto profile = recruiterService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}

