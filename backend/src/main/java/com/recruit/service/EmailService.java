package com.recruit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.mail.from}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public void sendInterviewInvite(String toEmail, String candidateName, String jobTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(toEmail);
        message.setSubject("Interview Invitation - " + jobTitle);
        message.setText("""
                Dear %s,

                We are pleased to invite you for an interview for the position of %s.

                Our HR team will reach out shortly to confirm the interview schedule.

                Best regards,
                Recruitment Team
                """.formatted(candidateName, jobTitle));
        mailSender.send(message);
    }
}
