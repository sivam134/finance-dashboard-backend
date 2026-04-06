package com.finance.dashboard.service;

import com.finance.dashboard.dto.CategoryTotalDTO;
import com.finance.dashboard.dto.DashboardSummaryDTO;
import com.finance.dashboard.dto.MonthlyTrendDTO;
import com.finance.dashboard.model.Transaction;
import com.finance.dashboard.model.TransactionType;
import com.finance.dashboard.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardSummaryDTO getSummary() {

        BigDecimal totalIncome  = Optional.ofNullable(
                transactionRepository.sumByType(TransactionType.INCOME))
                .orElse(BigDecimal.ZERO);

        BigDecimal totalExpense = Optional.ofNullable(
                transactionRepository.sumByType(TransactionType.EXPENSE))
                .orElse(BigDecimal.ZERO);

        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        List<CategoryTotalDTO> categoryTotals =
                transactionRepository.getCategoryTotals().stream()
                        .map(row -> new CategoryTotalDTO(
                                (String) row[0],
                                (BigDecimal) row[1]
                        ))
                        .sorted(Comparator.comparing(CategoryTotalDTO::getTotal).reversed())
                        .collect(Collectors.toList());

        List<Transaction> recent =
                transactionRepository.findTop5ByDeletedFalseOrderByCreatedAtDesc();

        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .categoryTotals(categoryTotals)
                .recentTransactions(recent)
                .build();
    }

    public Map<String, Object> getMonthlyTrends(int year) {

        int currentYear = Year.now().getValue();
        if (year < 2000 || year > currentYear) {
            throw new IllegalArgumentException(
                    "Year must be between 2000 and " + currentYear);
        }

        List<MonthlyTrendDTO> incomeTrend  = buildTrend(TransactionType.INCOME, year);
        List<MonthlyTrendDTO> expenseTrend = buildTrend(TransactionType.EXPENSE, year);

        List<MonthlyTrendDTO> netTrend = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            netTrend.add(new MonthlyTrendDTO(
                    incomeTrend.get(i).getMonth(),
                    incomeTrend.get(i).getAmount().subtract(expenseTrend.get(i).getAmount())
            ));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("year", year);
        result.put("income", incomeTrend);
        result.put("expense", expenseTrend);
        result.put("net", netTrend);

        return result;
    }

    private List<MonthlyTrendDTO> buildTrend(TransactionType type, int year) {

        Map<Integer, BigDecimal> monthMap = new HashMap<>();

        for (Object[] row : transactionRepository.getMonthlyTrend(type, year)) {
            int month = ((Number) row[0]).intValue();
            monthMap.put(month, (BigDecimal) row[1]);
        }

        List<MonthlyTrendDTO> trend = new ArrayList<>();

        for (int m = 1; m <= 12; m++) {
            String monthName = Month.of(m)
                    .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            trend.add(new MonthlyTrendDTO(
                    monthName,
                    monthMap.getOrDefault(m, BigDecimal.ZERO)
            ));
        }

        return trend;
    }
}