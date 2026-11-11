package com.jobconnect.service.impl;

import com.jobconnect.dto.JobSeekerProfileDto;
import com.jobconnect.entity.JobSeeker;
import com.jobconnect.entity.Resume;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.JobSeekerRepository;
import com.jobconnect.repository.ResumeRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.service.FileStorageService;
import com.jobconnect.service.JobSeekerService;
import com.jobconnect.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@Service
@Transactional
public class JobSeekerServiceImpl implements JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    public JobSeekerServiceImpl(
            JobSeekerRepository jobSeekerRepository,
            ResumeRepository resumeRepository,
            UserRepository userRepository,
            UserService userService,
            FileStorageService fileStorageService
    ) {
        this.jobSeekerRepository = jobSeekerRepository;
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.fileStorageService = fileStorageService;
    }

    @Override
    @Transactional(readOnly = true)
    public JobSeekerProfileDto getCurrentProfile() {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    JobSeeker newSeeker = new JobSeeker(user);
                    return jobSeekerRepository.save(newSeeker);
                });

        return mapToDto(seeker);
    }

    @Override
    public JobSeekerProfileDto updateProfile(JobSeekerProfileDto profileDto) {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Job Seeker profile not found"));

        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());
        user.setPhone(profileDto.getPhone());
        userRepository.save(user);

        seeker.setHeadline(profileDto.getHeadline());
        seeker.setBio(profileDto.getBio());
        seeker.setExperienceYears(profileDto.getExperienceYears());
        seeker.setEducation(profileDto.getEducation());
        seeker.setCurrentCompany(profileDto.getCurrentCompany());
        seeker.setSkills(profileDto.getSkills());
        seeker.setPortfolioUrl(profileDto.getPortfolioUrl());
        seeker.setGithubUrl(profileDto.getGithubUrl());
        seeker.setLinkedinUrl(profileDto.getLinkedinUrl());
        seeker.setLocation(profileDto.getLocation());

        JobSeeker updated = jobSeekerRepository.save(seeker);
        return mapToDto(updated);
    }

    @Override
    public JobSeekerProfileDto uploadResume(MultipartFile file) {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Job Seeker profile not found"));

        String storedFileName = fileStorageService.storeFile(file, "resumes");

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/resume/")
                .path(storedFileName)
                .toUriString();

        seeker.setResumeUrl(fileDownloadUri);
        seeker.setResumeOriginalFilename(file.getOriginalFilename());
        JobSeeker updated = jobSeekerRepository.save(seeker);

        Resume resume = new Resume(
                seeker,
                storedFileName,
                file.getOriginalFilename(),
                file.getContentType(),
                file.getSize(),
                fileDownloadUri
        );
        resumeRepository.save(resume);

        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Resume> getResumes() {
        User user = userService.getCurrentUser();
        JobSeeker seeker = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Job Seeker profile not found"));

        return resumeRepository.findByJobSeekerIdOrderByUploadedAtDesc(seeker.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public JobSeekerProfileDto getProfileById(Long id) {
        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobSeeker", "id", id));
        return mapToDto(seeker);
    }

    private JobSeekerProfileDto mapToDto(JobSeeker seeker) {
        JobSeekerProfileDto dto = new JobSeekerProfileDto();
        dto.setId(seeker.getId());
        dto.setUserId(seeker.getUser().getId());
        dto.setFirstName(seeker.getUser().getFirstName());
        dto.setLastName(seeker.getUser().getLastName());
        dto.setEmail(seeker.getUser().getEmail());
        dto.setPhone(seeker.getUser().getPhone());

        dto.setHeadline(seeker.getHeadline());
        dto.setBio(seeker.getBio());
        dto.setExperienceYears(seeker.getExperienceYears());
        dto.setEducation(seeker.getEducation());
        dto.setCurrentCompany(seeker.getCurrentCompany());
        dto.setSkills(seeker.getSkills());
        dto.setResumeUrl(seeker.getResumeUrl());
        dto.setResumeOriginalFilename(seeker.getResumeOriginalFilename());
        dto.setPortfolioUrl(seeker.getPortfolioUrl());
        dto.setGithubUrl(seeker.getGithubUrl());
        dto.setLinkedinUrl(seeker.getLinkedinUrl());
        dto.setLocation(seeker.getLocation());

        return dto;
    }
}

