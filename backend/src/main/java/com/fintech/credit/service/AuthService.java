package com.fintech.credit.service;

import com.fintech.credit.dto.*;
import com.fintech.credit.model.RefreshToken;
import com.fintech.credit.model.Role;
import com.fintech.credit.model.User;
import com.fintech.credit.repository.RefreshTokenRepository;
import com.fintech.credit.repository.UserRepository;
import com.fintech.credit.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    public AuthResponse register(RegisterRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .isPasswordChanged(true)
                .build();
        userRepository.save(user);
        
        auditService.log("USER_REGISTER", "New user registered: " + user.getEmail(), user.getEmail());
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .role(user.getRole().name())
                .name(user.getName())
                .isPasswordChanged(user.isPasswordChanged())
                .build();
    }

    public AuthResponse authenticate(LoginRequest request) {
        System.out.println("Login attempt - Email: " + request.getEmail() + " | Password Length: " + request.getPassword().length());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        
        auditService.log("USER_LOGIN", "User logged in: " + user.getEmail(), user.getEmail());
        
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .role(user.getRole().name())
                .name(user.getName())
                .isPasswordChanged(user.isPasswordChanged())
                .build();
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiry(Instant.now().plusMillis(604800000)) // 7 days
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public AuthResponse refreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return AuthResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(token)
                            .role(user.getRole().name())
                            .name(user.getName())
                            .isPasswordChanged(user.isPasswordChanged())
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiry().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        var user = userRepository.findByEmail(email).orElseThrow();
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong old password");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChanged(true);
        userRepository.save(user);
        
        auditService.log("PASSWORD_CHANGE", "User changed password: " + user.getEmail(), user.getEmail());
    }
}
