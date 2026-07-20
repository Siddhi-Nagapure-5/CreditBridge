package com.fintech.credit.repository;

import com.fintech.credit.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BranchRepository extends JpaRepository<Branch, UUID> {
    List<Branch> findAllByBankId(UUID bankId);
    long countByBankId(UUID bankId);
}
