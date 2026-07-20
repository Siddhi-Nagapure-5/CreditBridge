package com.fintech.credit.controller;

import com.fintech.credit.dto.*;
import com.fintech.credit.service.AuthService;
import com.fintech.credit.service.RateLimiterService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        Bucket bucket = rateLimiterService.resolveBucket(clientIp);
        
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(authService.authenticate(request));
        } else {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", "Too many attempts. Please try again later."));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
}
