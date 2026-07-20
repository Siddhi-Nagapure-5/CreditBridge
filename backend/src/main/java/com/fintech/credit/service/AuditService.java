package com.fintech.credit.service;

import com.fintech.credit.model.AuditLog;
import com.fintech.credit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void log(String action, String details, String performedBy) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .details(details)
                .performedBy(performedBy)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }
}
