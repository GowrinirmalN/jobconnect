package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.ApplicationRequestDto;
import com.jobconnect.dto.ApplicationResponseDto;
import com.jobconnect.dto.ApplicationStatusUpdateDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.ApplicationStatus;
import com.jobconnect.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Applications", description = "Job application submission, status tracking, and candidate review endpoints")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Apply for a job", description = "Job seeker submits application with optional cover letter and resume link")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> applyForJob(@Valid @RequestBody ApplicationRequestDto requestDto) {
        ApplicationResponseDto application = applicationService.applyForJob(requestDto);
        return new ResponseEntity<>(ApiResponse.success("Application submitted successfully", application), HttpStatus.CREATED);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get current seeker's applications", description = "Returns application history and statuses for logged in job seeker")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ApplicationResponseDto> response = applicationService.getMyApplications(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get recruiter's applicants", description = "List candidate applications for recruiter's postings with status and job filters")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponseDto>>> getRecruiterApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<ApplicationResponseDto> response = applicationService.getRecruiterApplications(jobId, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get application details", description = "View full application details by ID")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> getApplicationById(@PathVariable Long id) {
        ApplicationResponseDto response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update application status", description = "Recruiter shortlists, rejects, schedules interview, or accepts candidate")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDto updateDto
    ) {
        ApplicationResponseDto updated = applicationService.updateApplicationStatus(id, updateDto);
        return ResponseEntity.ok(ApiResponse.success("Application status updated", updated));
    }
}

