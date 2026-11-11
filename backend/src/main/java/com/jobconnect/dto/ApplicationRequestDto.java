package com.jobconnect.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequestDto {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverLetter;

    // Optional override if applicant specifies an existing or new resume URL
    private String resumeUrl;

    public ApplicationRequestDto() {}

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}

