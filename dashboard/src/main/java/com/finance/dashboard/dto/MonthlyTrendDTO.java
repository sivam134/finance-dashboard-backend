package com.finance.dashboard.dto;
import java.math.BigDecimal;
import lombok.*;
@Data @AllArgsConstructor
public class MonthlyTrendDTO{
    private String month;
    private BigDecimal amount;
}
