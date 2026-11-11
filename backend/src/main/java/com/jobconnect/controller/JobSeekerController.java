package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.JobSeekerProfileDto;
import com.jobconnect.entity.Resume;
import com.jobconnect.service.JobSeekerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/jobseekers")
@Tag(name = "Job Seekers", description = "Job seeker profile and resume management endpoints")
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    public JobSeekerController(JobSeekerService jobSeekerService) {
        this.jobSeekerService = jobSeekerService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Get current seeker profile", description = "Retrieve profile details for logged in job seeker")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> getCurrentProfile() {
        JobSeekerProfileDto profile = jobSeekerService.getCurrentProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Update current seeker profile", description = "Update bio, skills, education, links, and experience")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> updateProfile(@Valid @RequestBody JobSeekerProfileDto profileDto) {
        JobSeekerProfileDto updated = jobSeekerService.updateProfile(profileDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "Upload PDF resume", description = "Uploads a PDF/DOC resume and links it to candidate profile")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> uploadResume(@RequestParam("file") MultipartFile file) {
        JobSeekerProfileDto updated = jobSeekerService.uploadResume(file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", updated));
    }

    @GetMapping("/resumes")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    @Operation(summary = "List uploaded resumes", description = "Retrieve list of all uploaded resume documents for current seeker")
    public ResponseEntity<ApiResponse<List<Resume>>> getResumes() {
        List<Resume> resumes = jobSeekerService.getResumes();
        return ResponseEntity.ok(ApiResponse.success(resumes));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Get seeker profile by ID", description = "Recruiters and Admins can view full candidate profile")
    public ResponseEntity<ApiResponse<JobSeekerProfileDto>> getProfileById(@PathVariable Long id) {
        JobSeekerProfileDto profile = jobSeekerService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}

