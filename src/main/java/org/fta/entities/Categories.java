package org.fta.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Entity
@Data
public class Categories {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long categoryId;

  @NotNull
  private String categoryName;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = true)
  private Users users;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "categories", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Expenses> expenses;

  @OneToMany(mappedBy = "categories", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Budgets> budgets;

}
