package com.fintech.credit.controller;

import com.fintech.credit.dto.AdminCreateRequest;
import com.fintech.credit.dto.BranchCreateRequest;
import com.fintech.credit.dto.UserResponse;
import com.fintech.credit.model.Branch;
import com.fintech.credit.service.SuperAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/super")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    @GetMapping("/branches")
    public ResponseEntity<List<Branch>> getAllBranches() {
        return ResponseEntity.ok(superAdminService.getMyBranches());
    }

    @GetMapping("/admins")
    public ResponseEntity<List<UserResponse>> getAllAdmins() {
        return ResponseEntity.ok(superAdminService.getAllAdmins());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(superAdminService.getStats());
    }

    @PostMapping("/branches")
    public ResponseEntity<Branch> createBranch(@Valid @RequestBody BranchCreateRequest request) {
        return ResponseEntity.ok(superAdminService.createBranch(request));
    }

    @PostMapping("/admins")
    public ResponseEntity<String> createAdmin(@Valid @RequestBody AdminCreateRequest request) {
        superAdminService.createAdmin(request);
        return ResponseEntity.ok("AUTHORITY DELEGATED. TEMP_CRED_SENT_VIA_EMAIL.");
    }
}
