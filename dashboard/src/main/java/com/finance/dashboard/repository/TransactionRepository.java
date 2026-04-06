package com.finance.dashboard.repository;

import com.finance.dashboard.model.Transaction;
import com.finance.dashboard.model.TransactionType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Fetch all active transactions sorted by date
    List<Transaction> findByDeletedFalseOrderByDateDesc();
    // Filter by type (INCOME / EXPENSE)
    List<Transaction> findByDeletedFalseAndTypeOrderByDateDesc(TransactionType type);
    // Filter by category
    List<Transaction> findByDeletedFalseAndCategoryOrderByDateDesc(String category);
    // Filter by date range
    List<Transaction> findByDeletedFalseAndDateBetweenOrderByDateDesc(LocalDate from, LocalDate to);

    // Total amount by transaction type
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND t.deleted = false")
    BigDecimal sumByType(@Param("type") TransactionType type);

    // Category-wise totals
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.deleted = false GROUP BY t.category")
    List<Object[]> getCategoryTotals();

    // Monthly trend (month number + total)
    @Query("SELECT MONTH(t.date), SUM(t.amount) FROM Transaction t " +
           "WHERE t.type = :type AND YEAR(t.date) = :year AND t.deleted = false " +
           "GROUP BY MONTH(t.date) ORDER BY MONTH(t.date)")
    List<Object[]> getMonthlyTrend(@Param("type") TransactionType type,
                                  @Param("year") int year);

    // Fetch single active transaction
    Optional<Transaction> findByIdAndDeletedFalse(Long id);

    // Filter by type + category
    List<Transaction> findByDeletedFalseAndTypeAndCategoryOrderByDateDesc(
            TransactionType type, String category);

    // Latest 5 transactions
    List<Transaction> findTop5ByDeletedFalseOrderByCreatedAtDesc();
}