package org.fta.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
public class Budgets {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long budgetId;

  @NotNull
  private String budgetName;

  @NotNull
  private String budgetAmount;

  @NotNull
  private LocalDate startDate;

  @NotNull
  private LocalDate endDate;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private Users users;

  @ManyToOne
  @JoinColumn(name = "category_id", nullable = false)
  private Categories categories;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;
}
