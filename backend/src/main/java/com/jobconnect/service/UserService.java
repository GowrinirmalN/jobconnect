package com.jobconnect.service;

import com.jobconnect.dto.UserProfileDto;
import com.jobconnect.entity.User;

public interface UserService {
    User getCurrentUser();
    UserProfileDto getCurrentUserProfile();
    UserProfileDto updateUserProfile(UserProfileDto profileDto);
    void changePassword(String oldPassword, String newPassword);
}

