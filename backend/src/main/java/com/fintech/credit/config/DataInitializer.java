package com.fintech.credit.config;

import com.fintech.credit.model.Bank;
import com.fintech.credit.model.Role;
import com.fintech.credit.model.User;
import com.fintech.credit.repository.BankRepository;
import com.fintech.credit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BankRepository bankRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "aniketvasanevijay@gmail.com";
        
        Bank defaultBank = bankRepository.findByBankName("Modern FinTech Bank")
                .orElseGet(() -> bankRepository.save(Bank.builder().bankName("Modern FinTech Bank").build()));

        userRepository.findByEmail(adminEmail).ifPresentOrElse(
            user -> {
                if (user.getBank() == null) {
                    user.setBank(defaultBank);
                    user.setPasswordChanged(true);
                    userRepository.save(user);
                    System.out.println(">>> [PATCH] Existing Super Admin linked to default Bank");
                }
            },
            () -> {
                User admin = User.builder()
                        .name("Aniket Vasane")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.SUPER_ADMIN)
                        .bank(defaultBank)
                        .isPasswordChanged(true)
                        .build();
                userRepository.save(admin);
                System.out.println(">>> [SUCCESS] New Super Admin created and linked to Bank");
            }
        );
    }
}
