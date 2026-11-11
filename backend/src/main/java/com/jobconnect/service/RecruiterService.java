package com.jobconnect.service;

import com.jobconnect.dto.RecruiterProfileDto;

import java.util.Map;

public interface RecruiterService {
    RecruiterProfileDto getCurrentProfile();
    RecruiterProfileDto updateProfile(RecruiterProfileDto profileDto);
    Map<String, Object> getDashboardStats();
    RecruiterProfileDto getProfileById(Long id);
}

