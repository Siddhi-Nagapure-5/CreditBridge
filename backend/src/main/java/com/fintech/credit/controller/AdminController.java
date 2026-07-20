package com.fintech.credit.controller;

import com.fintech.credit.dto.ChangePasswordRequest;
import com.fintech.credit.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok("Password changed successfully.");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to Bank Admin Dashboard");
    }
}
