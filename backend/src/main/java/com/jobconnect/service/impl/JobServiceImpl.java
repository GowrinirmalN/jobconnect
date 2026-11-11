package com.jobconnect.service.impl;

import com.jobconnect.dto.JobRequestDto;
import com.jobconnect.dto.JobResponseDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.service.JobService;
import com.jobconnect.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public JobServiceImpl(
            JobRepository jobRepository,
            RecruiterRepository recruiterRepository,
            JobSeekerRepository jobSeekerRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            UserService userService
    ) {
        this.jobRepository = jobRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponseDto> searchJobs(
            String keyword,
            String location,
            JobType jobType,
            BigDecimal minSalary,
            BigDecimal maxSalary,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;

        Page<Job> jobs = jobRepository.searchJobs(
                cleanKeyword,
                cleanLocation,
                jobType,
                minSalary,
                maxSalary,
                JobStatus.ACTIVE,
                pageable
        );

        Long currentSeekerId = getCurrentSeekerIdSafe();

        List<JobResponseDto> content = jobs.getContent().stream()
                .map(job -> mapToDto(job, currentSeekerId))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                jobs.getNumber(),
                jobs.getSize(),
                jobs.getTotalElements(),
                jobs.getTotalPages(),
                jobs.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        Long currentSeekerId = getCurrentSeekerIdSafe();
        return mapToDto(job, currentSeekerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDto> getFeaturedJobs() {
        Long currentSeekerId = getCurrentSeekerIdSafe();
        return jobRepository.findTop6RecentJobs().stream()
                .map(job -> mapToDto(job, currentSeekerId))
                .collect(Collectors.toList());
    }

    @Override
    public JobResponseDto createJob(JobRequestDto dto) {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Only registered recruiters can post jobs"));

        Job job = new Job();
        job.setRecruiter(recruiter);
        copyDtoToJob(dto, job);

        Job savedJob = jobRepository.save(job);
        return mapToDto(savedJob, null);
    }

    @Override
    public JobResponseDto updateJob(Long id, JobRequestDto dto) {
        User user = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isOwner = job.getRecruiter().getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }

        copyDtoToJob(dto, job);
        Job updatedJob = jobRepository.save(job);
        return mapToDto(updatedJob, null);
    }

    @Override
    public void deleteJob(Long id) {
        User user = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isOwner = job.getRecruiter().getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    @Override
    public JobResponseDto toggleJobStatus(Long id, JobStatus status) {
        User user = userService.getCurrentUser();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        boolean isAdmin = user.getRole().getName() == RoleName.ROLE_ADMIN;
        boolean isOwner = job.getRecruiter().getUser().getId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedException("You are not authorized to modify this job");
        }

        job.setStatus(status);
        Job updated = jobRepository.save(job);
        return mapToDto(updated, null);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponseDto> getRecruiterJobs(int page, int size) {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByRecruiterId(recruiter.getId(), pageable);

        List<JobResponseDto> content = jobs.getContent().stream()
                .map(job -> mapToDto(job, null))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                jobs.getNumber(),
                jobs.getSize(),
                jobs.getTotalElements(),
                jobs.getTotalPages(),
                jobs.isLast()
        );
    }

    private void copyDtoToJob(JobRequestDto dto, Job job) {
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements());
        job.setResponsibilities(dto.getResponsibilities());
        job.setJobType(dto.getJobType());
        job.setLocation(dto.getLocation());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setSalaryMin(dto.getSalaryMin());
        job.setSalaryMax(dto.getSalaryMax());
        job.setSalaryNegotiable(dto.isSalaryNegotiable());
        job.setSkillsRequired(dto.getSkillsRequired());
        job.setStatus(dto.getStatus() != null ? dto.getStatus() : JobStatus.ACTIVE);
        job.setVacancies(dto.getVacancies() != null ? dto.getVacancies() : 1);
        job.setApplicationDeadline(dto.getApplicationDeadline());
    }

    private JobResponseDto mapToDto(Job job, Long currentSeekerId) {
        JobResponseDto dto = new JobResponseDto();
        dto.setId(job.getId());
        dto.setRecruiterId(job.getRecruiter().getId());
        dto.setCompanyName(job.getRecruiter().getCompanyName());
        dto.setCompanyLogo(job.getRecruiter().getCompanyLogo());
        dto.setCompanyWebsite(job.getRecruiter().getCompanyWebsite());
        dto.setRecruiterName(job.getRecruiter().getUser().getFullName());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setJobType(job.getJobType());
        dto.setLocation(job.getLocation());
        dto.setExperienceLevel(job.getExperienceLevel());
        dto.setSalaryMin(job.getSalaryMin());
        dto.setSalaryMax(job.getSalaryMax());
        dto.setSalaryNegotiable(job.isSalaryNegotiable());
        dto.setSkillsRequired(job.getSkillsRequired());
        dto.setStatus(job.getStatus());
        dto.setVacancies(job.getVacancies());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());

        dto.setApplicantCount(applicationRepository.countByJobId(job.getId()));

        if (currentSeekerId != null) {
            dto.setHasApplied(applicationRepository.existsByJobIdAndJobSeekerId(job.getId(), currentSeekerId));
        } else {
            dto.setHasApplied(false);
        }

        return dto;
    }

    private Long getCurrentSeekerIdSafe() {
        try {
            org.springframework.security.core.Authentication authentication =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())
                    || "anonymousUser".equals(authentication.getName())) {
                return null;
            }
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null && user.getRole().getName() == RoleName.ROLE_JOB_SEEKER) {
                return jobSeekerRepository.findByUserId(user.getId())
                        .map(JobSeeker::getId)
                        .orElse(null);
            }
        } catch (Exception ignored) {
            // Unauthenticated or not a seeker
        }
        return null;
    }
}
