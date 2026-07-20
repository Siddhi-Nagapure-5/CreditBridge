package com.fintech.credit.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendAdminCredentials(String email, String name, String tempPassword) {
        log.info("PREPARING REAL EMAIL FOR: {}", email);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Your Institutional Access Credentials - CreditBridge");
            message.setText(String.format(
                "Hello %s,\n\n" +
                "Welcome to the Modern FinTech perimeter.\n\n" +
                "Your temporary access portal password is: %s\n\n" +
                "Please change your password upon your first deployment.\n\n" +
                "Regards,\n" +
                "CreditBridge Auth System",
                name, tempPassword
            ));
            
            mailSender.send(message);
            log.info("SUCCESS: Email dispatched via SMTP node.");
            
        } catch (Exception e) {
            log.error("FAILURE: Unable to dispatch real email. Reverting to console-only output.");
            log.error("Exception detail: {}", e.getMessage());
            
            // Fallback mock trace so the dev can still see the password
            log.info("------------------------------------------------------------");
            log.info("FALLBACK CREDENTIAL LOG:");
            log.info("   User: {}", name);
            log.info("   Password: {}", tempPassword);
            log.info("------------------------------------------------------------");
        }
    }
}
