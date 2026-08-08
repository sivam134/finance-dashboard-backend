package org.fta.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;
import org.fta.enums.PaymentType;

@Entity
@Builder
public class Expenses {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long expenseId;

    @NotNull
    private Double amount;

    private String description;

    private LocalDateTime expenseDateTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Categories categories;

    private PaymentType paymentType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
