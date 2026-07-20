package com.fintech.credit.repository;

import com.fintech.credit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

import com.fintech.credit.model.Role;
import java.util.List;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findAllByRole(Role role);
    long countByRole(Role role);
}
