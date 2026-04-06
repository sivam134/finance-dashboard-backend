package com.finance.dashboard;

import com.finance.dashboard.model.Role;
import com.finance.dashboard.model.Transaction;
import com.finance.dashboard.model.TransactionType;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Prevent duplicate seeding
        if (userRepository.count() > 0) {
            return;
        }

        // ─── Users ─────────────────────────────────────────────

        User admin = userRepository.save(User.builder()
                .username("admin")
                .email("admin@demo.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .username("analyst")
                .email("analyst@demo.com")
                .password(passwordEncoder.encode("analyst123"))
                .role(Role.ANALYST)
                .active(true)
                .build());

        userRepository.save(User.builder()
                .username("viewer")
                .email("viewer@demo.com")
                .password(passwordEncoder.encode("viewer123"))
                .role(Role.VIEWER)
                .active(true)
                .build());

        // ─── Transactions ─────────────────────────────────────

        LocalDate now = LocalDate.now();

        // Income
        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("55000.00"))
                .type(TransactionType.INCOME)
                .category("Salary")
                .date(now.minusDays(2))
                .notes("Monthly salary")
                .deleted(false)
                .build());

        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("12000.00"))
                .type(TransactionType.INCOME)
                .category("Freelance")
                .date(now.minusDays(10))
                .notes("Web project")
                .deleted(false)
                .build());

        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("3500.00"))
                .type(TransactionType.INCOME)
                .category("Investments")
                .date(now.minusDays(15))
                .notes("Returns")
                .deleted(false)
                .build());

        // Expense
        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("12000.00"))
                .type(TransactionType.EXPENSE)
                .category("Rent")
                .date(now.minusDays(5))
                .notes("Monthly rent")
                .deleted(false)
                .build());

        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("4500.00"))
                .type(TransactionType.EXPENSE)
                .category("Groceries")
                .date(now.minusDays(7))
                .notes("Food")
                .deleted(false)
                .build());

        transactionRepository.save(Transaction.builder()
                .user(admin)
                .amount(new BigDecimal("1500.00"))
                .type(TransactionType.EXPENSE)
                .category("Utilities")
                .date(now.minusDays(3))
                .notes("Electricity")
                .deleted(false)
                .build());

        System.out.println("✅ DataSeeder: users and transactions created.");
    }
}