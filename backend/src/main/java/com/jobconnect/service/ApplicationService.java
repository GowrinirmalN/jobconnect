package com.jobconnect.service;

import com.jobconnect.dto.ApplicationRequestDto;
import com.jobconnect.dto.ApplicationResponseDto;
import com.jobconnect.dto.ApplicationStatusUpdateDto;
import com.jobconnect.dto.PagedResponse;
import com.jobconnect.entity.ApplicationStatus;

public interface ApplicationService {
    ApplicationResponseDto applyForJob(ApplicationRequestDto requestDto);

    PagedResponse<ApplicationResponseDto> getMyApplications(int page, int size);

    PagedResponse<ApplicationResponseDto> getRecruiterApplications(Long jobId, ApplicationStatus status, int page, int size);

    ApplicationResponseDto getApplicationById(Long id);

    ApplicationResponseDto updateApplicationStatus(Long id, ApplicationStatusUpdateDto updateDto);
}

