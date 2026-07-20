package com.fintech.credit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String role;
    private String name;
    @com.fasterxml.jackson.annotation.JsonProperty("isPasswordChanged")
    private boolean isPasswordChanged;
}
