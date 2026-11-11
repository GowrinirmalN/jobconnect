package com.jobconnect.dto;

import com.jobconnect.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdateDto {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String notes;

    public ApplicationStatusUpdateDto() {}

    public ApplicationStatusUpdateDto(ApplicationStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

