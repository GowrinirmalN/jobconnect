package com.jobconnect.service.impl;

import com.jobconnect.dto.RecruiterProfileDto;
import com.jobconnect.entity.ApplicationStatus;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.Recruiter;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.RecruiterRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.service.RecruiterService;
import com.jobconnect.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserService userService;

    public RecruiterServiceImpl(
            RecruiterRepository recruiterRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            UserService userService
    ) {
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userService = userService;
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileDto getCurrentProfile() {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Recruiter newRecruiter = new Recruiter(user, user.getFirstName() + "'s Organization");
                    return recruiterRepository.save(newRecruiter);
                });

        return mapToDto(recruiter);
    }

    @Override
    public RecruiterProfileDto updateProfile(RecruiterProfileDto profileDto) {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());
        user.setPhone(profileDto.getPhone());
        userRepository.save(user);

        recruiter.setCompanyName(profileDto.getCompanyName());
        recruiter.setCompanyWebsite(profileDto.getCompanyWebsite());
        recruiter.setCompanyDescription(profileDto.getCompanyDescription());
        recruiter.setCompanyLogo(profileDto.getCompanyLogo());
        recruiter.setIndustry(profileDto.getIndustry());
        recruiter.setLocation(profileDto.getLocation());
        recruiter.setDesignation(profileDto.getDesignation());

        Recruiter updated = recruiterRepository.save(recruiter);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        User user = userService.getCurrentUser();
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Long recruiterId = recruiter.getId();

        long totalJobs = jobRepository.countByRecruiterId(recruiterId);
        long activeJobs = jobRepository.findByRecruiterId(recruiterId).stream()
                .filter(j -> j.getStatus() == JobStatus.ACTIVE).count();
        long totalApplicants = applicationRepository.countByJobRecruiterId(recruiterId);
        long shortlisted = applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.SHORTLISTED);
        long interviews = applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.INTERVIEW_SCHEDULED);
        long hired = applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.ACCEPTED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalJobs", totalJobs);
        stats.put("activeJobs", activeJobs);
        stats.put("totalApplicants", totalApplicants);
        stats.put("shortlisted", shortlisted);
        stats.put("interviews", interviews);
        stats.put("hired", hired);

        return stats;
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileDto getProfileById(Long id) {
        Recruiter recruiter = recruiterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter", "id", id));
        return mapToDto(recruiter);
    }

    private RecruiterProfileDto mapToDto(Recruiter recruiter) {
        RecruiterProfileDto dto = new RecruiterProfileDto();
        dto.setId(recruiter.getId());
        dto.setUserId(recruiter.getUser().getId());
        dto.setFirstName(recruiter.getUser().getFirstName());
        dto.setLastName(recruiter.getUser().getLastName());
        dto.setEmail(recruiter.getUser().getEmail());
        dto.setPhone(recruiter.getUser().getPhone());

        dto.setCompanyName(recruiter.getCompanyName());
        dto.setCompanyWebsite(recruiter.getCompanyWebsite());
        dto.setCompanyDescription(recruiter.getCompanyDescription());
        dto.setCompanyLogo(recruiter.getCompanyLogo());
        dto.setIndustry(recruiter.getIndustry());
        dto.setLocation(recruiter.getLocation());
        dto.setDesignation(recruiter.getDesignation());

        return dto;
    }
}

