package com.fintech.credit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BankCreateRequest {
    @NotBlank
    private String bankName;
}
