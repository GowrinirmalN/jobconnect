package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.JobRequestDto;
import com.jobconnect.dto.JobResponseDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;
import com.jobconnect.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Job postings management and public search endpoints")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Search jobs", description = "Public search with pagination, filtering by keyword, location, job type and salary range")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<JobResponseDto> response = jobService.searchJobs(
                keyword, location, jobType, minSalary, maxSalary, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured jobs", description = "Returns top recent active jobs for the homepage")
    public ResponseEntity<ApiResponse<List<JobResponseDto>>> getFeaturedJobs() {
        List<JobResponseDto> jobs = jobService.getFeaturedJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID", description = "Public job detail view with company info and applicant status")
    public ResponseEntity<ApiResponse<JobResponseDto>> getJobById(@PathVariable Long id) {
        JobResponseDto job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Create job posting", description = "Post a new vacancy (Recruiter only)")
    public ResponseEntity<ApiResponse<JobResponseDto>> createJob(@Valid @RequestBody JobRequestDto jobRequestDto) {
        JobResponseDto created = jobService.createJob(jobRequestDto);
        return new ResponseEntity<>(ApiResponse.success("Job posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Update job posting", description = "Edit an existing job vacancy")
    public ResponseEntity<ApiResponse<JobResponseDto>> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequestDto jobRequestDto
    ) {
        JobResponseDto updated = jobService.updateJob(id, jobRequestDto);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Delete job posting", description = "Permanently delete a job posting")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Toggle job status", description = "Change job status (ACTIVE/CLOSED/DRAFT)")
    public ResponseEntity<ApiResponse<JobResponseDto>> toggleJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status
    ) {
        JobResponseDto updated = jobService.toggleJobStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Job status updated", updated));
    }

    @GetMapping("/recruiter/my-jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Get jobs posted by current recruiter", description = "Returns all jobs posted by the logged in recruiter")
    public ResponseEntity<ApiResponse<PagedResponse<JobResponseDto>>> getRecruiterJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobResponseDto> response = jobService.getRecruiterJobs(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

