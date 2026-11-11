package com.jobconnect.service.impl;

import com.jobconnect.dto.*;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.*;
import com.jobconnect.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final RecruiterRepository recruiterRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            JobSeekerRepository jobSeekerRepository,
            RecruiterRepository recruiterRepository
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.jobSeekerRepository = jobSeekerRepository;
        this.recruiterRepository = recruiterRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getDashboardStats() {
        AdminStatsDto stats = new AdminStatsDto();

        long totalUsers = userRepository.count();
        long totalSeekers = userRepository.countByRoleName(RoleName.ROLE_JOB_SEEKER);
        long totalRecruiters = userRepository.countByRoleName(RoleName.ROLE_RECRUITER);

        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.ACTIVE);
        long closedJobs = jobRepository.countByStatus(JobStatus.CLOSED);

        long totalApplications = applicationRepository.count();
        long shortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long hired = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED);

        stats.setTotalUsers(totalUsers);
        stats.setTotalJobSeekers(totalSeekers);
        stats.setTotalRecruiters(totalRecruiters);
        stats.setTotalJobs(totalJobs);
        stats.setActiveJobs(activeJobs);
        stats.setClosedJobs(closedJobs);
        stats.setTotalApplications(totalApplications);
        stats.setShortlistedApplications(shortlisted);
        stats.setHiredApplications(hired);

        Map<String, Long> statusMap = new HashMap<>();
        for (ApplicationStatus st : ApplicationStatus.values()) {
            statusMap.put(st.name(), applicationRepository.countByStatus(st));
        }
        stats.setApplicationsByStatus(statusMap);

        Map<String, Long> jobTypeMap = new HashMap<>();
        List<Job> allJobs = jobRepository.findAll();
        for (JobType jt : JobType.values()) {
            long count = allJobs.stream().filter(j -> j.getJobType() == jt).count();
            jobTypeMap.put(jt.name(), count);
        }
        stats.setJobsByType(jobTypeMap);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserManagementDto> getAllUsers(String keyword, RoleName roleName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;

        Page<User> users = userRepository.searchUsers(cleanKeyword, roleName, pageable);

        List<UserManagementDto> content = users.getContent().stream()
                .map(this::mapUserToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages(),
                users.isLast()
        );
    }

    @Override
    public UserManagementDto toggleUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole().getName() == RoleName.ROLE_ADMIN) {
            throw new BadRequestException("Cannot modify status of Admin account");
        }

        user.setActive(active);
        User saved = userRepository.save(user);
        return mapUserToDto(saved);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole().getName() == RoleName.ROLE_ADMIN) {
            throw new BadRequestException("Cannot delete Admin user");
        }

        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<JobResponseDto> getAllJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findAll(pageable);

        List<JobResponseDto> content = jobs.getContent().stream()
                .map(job -> {
                    JobResponseDto dto = new JobResponseDto();
                    dto.setId(job.getId());
                    dto.setRecruiterId(job.getRecruiter().getId());
                    dto.setCompanyName(job.getRecruiter().getCompanyName());
                    dto.setRecruiterName(job.getRecruiter().getUser().getFullName());
                    dto.setTitle(job.getTitle());
                    dto.setDescription(job.getDescription());
                    dto.setJobType(job.getJobType());
                    dto.setLocation(job.getLocation());
                    dto.setSalaryMin(job.getSalaryMin());
                    dto.setSalaryMax(job.getSalaryMax());
                    dto.setStatus(job.getStatus());
                    dto.setApplicantCount(applicationRepository.countByJobId(job.getId()));
                    dto.setCreatedAt(job.getCreatedAt());
                    return dto;
                })
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
    public void deleteJobByAdmin(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ApplicationResponseDto> getAllApplications(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> apps = applicationRepository.findAll(pageable);

        List<ApplicationResponseDto> content = apps.getContent().stream()
                .map(app -> {
                    ApplicationResponseDto dto = new ApplicationResponseDto();
                    dto.setId(app.getId());
                    dto.setJobId(app.getJob().getId());
                    dto.setJobTitle(app.getJob().getTitle());
                    dto.setCompanyName(app.getJob().getRecruiter().getCompanyName());
                    dto.setJobSeekerId(app.getJobSeeker().getId());
                    dto.setApplicantName(app.getJobSeeker().getUser().getFullName());
                    dto.setApplicantEmail(app.getJobSeeker().getUser().getEmail());
                    dto.setStatus(app.getStatus());
                    dto.setAppliedAt(app.getAppliedAt());
                    return dto;
                })
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                apps.getNumber(),
                apps.getSize(),
                apps.getTotalElements(),
                apps.getTotalPages(),
                apps.isLast()
        );
    }

    private UserManagementDto mapUserToDto(User user) {
        UserManagementDto dto = new UserManagementDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().getName().name());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getRole().getName() == RoleName.ROLE_RECRUITER) {
            recruiterRepository.findByUserId(user.getId())
                    .ifPresent(r -> dto.setCompanyOrHeadline(r.getCompanyName()));
        } else if (user.getRole().getName() == RoleName.ROLE_JOB_SEEKER) {
            jobSeekerRepository.findByUserId(user.getId())
                    .ifPresent(s -> dto.setCompanyOrHeadline(s.getHeadline()));
        } else {
            dto.setCompanyOrHeadline("System Administrator");
        }

        return dto;
    }
}

