package com.jobconnect.service;

import com.jobconnect.dto.JobRequestDto;
import com.jobconnect.dto.JobResponseDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;

import java.math.BigDecimal;
import java.util.List;

public interface JobService {
    PagedResponse<JobResponseDto> searchJobs(
            String keyword,
            String location,
            JobType jobType,
            BigDecimal minSalary,
            BigDecimal maxSalary,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    JobResponseDto getJobById(Long id);

    List<JobResponseDto> getFeaturedJobs();

    JobResponseDto createJob(JobRequestDto jobRequestDto);

    JobResponseDto updateJob(Long id, JobRequestDto jobRequestDto);

    void deleteJob(Long id);

    JobResponseDto toggleJobStatus(Long id, JobStatus status);

    PagedResponse<JobResponseDto> getRecruiterJobs(int page, int size);
}

