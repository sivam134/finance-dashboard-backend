package com.finance.dashboard.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique username for login
    @Column(unique = true, nullable = false)
    private String username;

    // Unique email identifier
    @Column(unique = true, nullable = false)
    private String email;

    // Encrypted password
    @Column(nullable = false)
    private String password;

    // Role used for authorization
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Soft active flag
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    private LocalDateTime createdAt;

    // Auto-set creation timestamp
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}