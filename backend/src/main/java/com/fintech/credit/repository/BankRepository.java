package com.fintech.credit.repository;

import com.fintech.credit.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, UUID> {
    Optional<Bank> findByBankName(String bankName);
}
