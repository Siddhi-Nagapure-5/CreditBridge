package com.fintech.credit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class AdminCreateRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    @NotNull
    private UUID branchId;
}
