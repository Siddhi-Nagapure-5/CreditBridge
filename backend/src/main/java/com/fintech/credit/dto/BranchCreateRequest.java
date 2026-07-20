package com.fintech.credit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BranchCreateRequest {
    @NotBlank
    private String branchName;
    @NotBlank
    private String branchCode;
}
