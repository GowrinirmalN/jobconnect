package com.jobconnect.service;

import com.jobconnect.dto.JobSeekerProfileDto;
import com.jobconnect.entity.Resume;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface JobSeekerService {
    JobSeekerProfileDto getCurrentProfile();
    JobSeekerProfileDto updateProfile(JobSeekerProfileDto profileDto);
    JobSeekerProfileDto uploadResume(MultipartFile file);
    List<Resume> getResumes();
    JobSeekerProfileDto getProfileById(Long id);
}

