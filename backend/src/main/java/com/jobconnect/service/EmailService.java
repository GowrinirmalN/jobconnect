package com.jobconnect.service;

import com.jobconnect.entity.Application;

public interface EmailService {
    void sendApplicationStatusUpdateEmail(Application application);
    void sendNewApplicationEmailToRecruiter(Application application);
}

