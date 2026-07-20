package com.fintech.credit.service;

import com.fintech.credit.dto.AdminCreateRequest;
import com.fintech.credit.dto.BranchCreateRequest;
import com.fintech.credit.dto.UserResponse;
import com.fintech.credit.model.Bank;
import com.fintech.credit.model.Branch;
import com.fintech.credit.model.Role;
import com.fintech.credit.model.User;
import com.fintech.credit.repository.BranchRepository;
import com.fintech.credit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SuperAdminService {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final EmailService emailService;

    private User getCurrentSuperAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Super Admin not found"));
    }

    @Transactional
    public Branch createBranch(BranchCreateRequest request) {
        User superAdmin = getCurrentSuperAdmin();
        Bank bank = superAdmin.getBank();
        
        log.info("Attempting to create branch for Super Admin: {} (Institution ID: {})", 
                superAdmin.getEmail(), (bank != null ? bank.getId() : "NULL"));

        if (bank == null) {
            log.error("ACCESS_DENIED: Super Admin {} is not associated with an institution node.", superAdmin.getEmail());
            throw new RuntimeException("Super Admin is not associated with any bank");
        }

        Branch branch = Branch.builder()
                .branchName(request.getBranchName())
                .branchCode(request.getBranchCode())
                .bank(bank)
                .build();
                
        branch = branchRepository.save(branch);
        auditService.log("BRANCH_CREATE", "Created branch: " + branch.getBranchName() + " for bank: " + bank.getBankName(), superAdmin.getEmail());
        return branch;
    }

    @Transactional
    public void createAdmin(AdminCreateRequest request) {
        User superAdmin = getCurrentSuperAdmin();
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));
        
        // Ensure branch belongs to the same bank as Super Admin
        if (!branch.getBank().getId().equals(superAdmin.getBank().getId())) {
            throw new RuntimeException("Unauthorized: Branch does not belong to your institution");
        }

        String tempPassword = generateTempPassword();
        
        User admin = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(tempPassword))
                .role(Role.BANK_ADMIN)
                .bank(superAdmin.getBank())
                .branch(branch)
                .isPasswordChanged(false)
                .build();
        
        userRepository.save(admin);
        
        // Send email with credentials
        emailService.sendAdminCredentials(admin.getEmail(), admin.getName(), tempPassword);
        
        auditService.log("ADMIN_CREATE", "Created admin for branch: " + branch.getBranchName(), superAdmin.getEmail());
    }

    public List<Branch> getMyBranches() {
        User superAdmin = getCurrentSuperAdmin();
        return branchRepository.findAllByBankId(superAdmin.getBank().getId());
    }

    public List<UserResponse> getAllAdmins() {
        User superAdmin = getCurrentSuperAdmin();
        return userRepository.findAllByRole(Role.BANK_ADMIN).stream()
                .filter(u -> u.getBank() != null && u.getBank().getId().equals(superAdmin.getBank().getId()))
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .bankName(user.getBranch() != null ? user.getBranch().getBranchName() : "N/A") // Show branch name in bankName field for UI ease
                        .build())
                .collect(Collectors.toList());
    }

    public Map<String, Long> getStats() {
        User superAdmin = getCurrentSuperAdmin();
        UUID bankId = superAdmin.getBank().getId();
        
        return Map.of(
            "totalBranches", branchRepository.countByBankId(bankId),
            "totalAdmins", (long) getAllAdmins().size(),
            "totalAuditLogs", 0L // Placeholder
        );
    }

    private String generateTempPassword() {
        return "Temp@" + UUID.randomUUID().toString().substring(0, 8);
    }
}

