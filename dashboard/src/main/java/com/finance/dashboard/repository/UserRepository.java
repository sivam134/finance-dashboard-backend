package com.finance.dashboard.repository;

import com.finance.dashboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    // Fetch user by username (used in authentication)
    Optional<User> findByUsername(String username);
    // Check if email already exists
    boolean existsByEmail(String email);
    // Check if username already exists
    boolean existsByUsername(String username);
}