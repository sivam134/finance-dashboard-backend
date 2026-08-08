package org.fta.dto;


import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ExpenseDto {
    private String userId;
    private BigDecimal amount;
    private Long categoryId;
    private LocalDateTime expenseDateTime;
    private String expenseDescription;

}
