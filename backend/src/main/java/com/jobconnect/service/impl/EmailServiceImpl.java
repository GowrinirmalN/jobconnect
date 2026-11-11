package com.jobconnect.service.impl;

import com.jobconnect.entity.Application;
import com.jobconnect.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    @Async
    public void sendApplicationStatusUpdateEmail(Application application) {
        String recipient = application.getJobSeeker().getUser().getEmail();
        String subject = "JobConnect: Status Update for your application to " + application.getJob().getTitle();
        String body = String.format(
                "Hello %s,\n\n" +
                "The status of your application for the position of '%s' at '%s' has been updated to: %s.\n\n" +
                "Recruiter Note: %s\n\n" +
                "Log in to your JobConnect account to view full details.\n\n" +
                "Best regards,\nJobConnect Team",
                application.getJobSeeker().getUser().getFirstName(),
                application.getJob().getTitle(),
                application.getJob().getRecruiter().getCompanyName(),
                application.getStatus(),
                application.getNotes() != null ? application.getNotes() : "No additional notes provided."
        );

        sendEmail(recipient, subject, body);
    }

    @Override
    @Async
    public void sendNewApplicationEmailToRecruiter(Application application) {
        String recipient = application.getJob().getRecruiter().getUser().getEmail();
        String subject = "JobConnect: New Application received for " + application.getJob().getTitle();
        String body = String.format(
                "Hello %s,\n\n" +
                "You have received a new application from %s for the position '%s'.\n\n" +
                "Candidate Experience: %s years\n" +
                "Skills: %s\n\n" +
                "Log in to your JobConnect Recruiter Dashboard to review the applicant and resume.\n\n" +
                "Best regards,\nJobConnect Team",
                application.getJob().getRecruiter().getUser().getFirstName(),
                application.getJobSeeker().getUser().getFullName(),
                application.getJob().getTitle(),
                application.getJobSeeker().getExperienceYears() != null ? application.getJobSeeker().getExperienceYears() : 0,
                application.getJobSeeker().getSkills() != null ? application.getJobSeeker().getSkills() : "Not specified"
        );

        sendEmail(recipient, subject, body);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(text);
                mailSender.send(message);
                logger.info("Sent email notification to: {}", to);
            } else {
                logger.info("[Mock Mail Notification] To: {}\nSubject: {}\nBody:\n{}", to, subject, text);
            }
        } catch (Exception e) {
            logger.warn("Failed to send real email to {}: {}. Logged notification instead.", to, e.getMessage());
        }
    }
}

