package com.jobconnect.service.impl;

import com.jobconnect.dto.ApplicationRequestDto;
import com.jobconnect.dto.ApplicationResponseDto;
import com.jobconnect.dto.ApplicationStatusUpdateDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.DuplicateResourceException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.service.ApplicationService;
import com.jobconnect.service.EmailService;
import com.jobconnect.service.NotificationService;
import com.jobconnect.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final RecruiterRepository recruiterRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            JobSeekerRepository jobSeekerRepository,
            RecruiterRepository recruiterRepository,
            UserService userService,
            NotificationService notificationService,
            EmailService emailService
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.recruiterRepository = recruiterRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.emailService = emailService;
    }

    @Override
    public ApplicationResponseDto applyForJob(ApplicationRequestDto requestDto) {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Only job seekers can apply for jobs"));

        Job job = jobRepository.findById(requestDto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", requestDto.getJobId()));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job is no longer accepting applications");
        }

        if (applicationRepository.existsByJobIdAndJobSeekerId(job.getId(), seeker.getId())) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        String resumeToUse = (requestDto.getResumeUrl() != null && !requestDto.getResumeUrl().isBlank())
                ? requestDto.getResumeUrl()
                : seeker.getResumeUrl();

        if (resumeToUse == null || resumeToUse.isBlank()) {
            throw new BadRequestException("Please upload a resume to your profile before applying");
        }

        Application application = new Application(
                job,
                seeker,
                requestDto.getCoverLetter(),
                resumeToUse
        );

        Application savedApp = applicationRepository.save(application);

        // Notify recruiter
        User recruiterUser = job.getRecruiter().getUser();
        notificationService.createNotification(
                recruiterUser,
                "New Applicant: " + user.getFullName(),
                String.format("%s applied for '%s'", user.getFullName(), job.getTitle()),
                "NEW_APPLICANT"
        );

        // Send notification email asynchronously
        emailService.sendNewApplicationEmailToRecruiter(savedApp);

        return mapToDto(savedApp);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponseDto> getMyApplications(int page, int size) {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Job seeker profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage = applicationRepository.findByJobSeekerId(seeker.getId(), pageable);

        List<ApplicationResponseDto> content = appPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponseDto> getRecruiterApplications(Long jobId, ApplicationStatus status, int page, int size) {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> appPage = applicationRepository.findRecruiterApplications(recruiter.getId(), jobId, status, pageable);

        List<ApplicationResponseDto> content = appPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                appPage.getNumber(),
                appPage.getSize(),
                appPage.getTotalElements(),
                appPage.getTotalPages(),
                appPage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponseDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        User user = userService.getCurrentUser();
        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isApplicant = application.getJobSeeker().getUser().getId().equals(user.getId());
        boolean isRecruiter = application.getJob().getRecruiter().getUser().getId().equals(user.getId());

        if (!isAdmin && !isApplicant && !isRecruiter) {
            throw new UnauthorizedException("You do not have permission to view this application");
        }

        return mapToDto(application);
    }

    @Override
    public ApplicationResponseDto updateApplicationStatus(Long id, ApplicationStatusUpdateDto updateDto) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

        User user = userService.getCurrentUser();
        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isRecruiter = application.getJob().getRecruiter().getUser().getId().equals(user.getId());

        if (!isAdmin && !isRecruiter) {
            throw new UnauthorizedException("You do not have permission to update this application status");
        }

        application.setStatus(updateDto.getStatus());
        if (updateDto.getNotes() != null) {
            application.setNotes(updateDto.getNotes());
        }

        Application updated = applicationRepository.save(application);

        // Notify candidate
        User candidateUser = application.getJobSeeker().getUser();
        notificationService.createNotification(
                candidateUser,
                "Application Status Update: " + application.getJob().getTitle(),
                String.format("Your application for '%s' at %s is now %s.",
                        application.getJob().getTitle(),
                        application.getJob().getRecruiter().getCompanyName(),
                        updateDto.getStatus()),
                "APPLICATION_UPDATE"
        );

        // Send email notification
        emailService.sendApplicationStatusUpdateEmail(updated);

        return mapToDto(updated);
    }

    private ApplicationResponseDto mapToDto(Application app) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompanyName(app.getJob().getRecruiter().getCompanyName());
        dto.setCompanyLogo(app.getJob().getRecruiter().getCompanyLogo());
        dto.setJobLocation(app.getJob().getLocation());
        dto.setJobType(app.getJob().getJobType());

        dto.setJobSeekerId(app.getJobSeeker().getId());
        dto.setApplicantName(app.getJobSeeker().getUser().getFullName());
        dto.setApplicantEmail(app.getJobSeeker().getUser().getEmail());
        dto.setApplicantPhone(app.getJobSeeker().getUser().getPhone());
        dto.setApplicantHeadline(app.getJobSeeker().getHeadline());
        dto.setApplicantSkills(app.getJobSeeker().getSkills());
        dto.setExperienceYears(app.getJobSeeker().getExperienceYears());

        dto.setCoverLetter(app.getCoverLetter());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setResumeOriginalFilename(app.getJobSeeker().getResumeOriginalFilename());
        dto.setStatus(app.getStatus());
        dto.setNotes(app.getNotes());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());

        return dto;
    }
}

