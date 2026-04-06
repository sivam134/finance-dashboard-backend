package com.finance.dashboard.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

import com.finance.dashboard.model.Transaction;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netBalance;

    private List<CategoryTotalDTO> categoryTotals;

    // Latest transactions (consider DTO instead of entity in production)
    private List<Transaction> recentTransactions;
}