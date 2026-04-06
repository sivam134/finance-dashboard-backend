package com.finance.dashboard.service;

import com.finance.dashboard.dto.TransactionRequest;
import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.model.Transaction;
import com.finance.dashboard.model.TransactionType;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.TransactionRepository;
import com.finance.dashboard.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public List<Transaction> getAll(TransactionType type,
                                    String category,
                                    LocalDate from,
                                    LocalDate to) {

        if (from != null && to != null) {
            if (from.isAfter(to)) {
                throw new IllegalArgumentException("'from' must be before 'to'");
            }
            return transactionRepository
                    .findByDeletedFalseAndDateBetweenOrderByDateDesc(from, to);
        }

        if (type != null && category != null) {
            return transactionRepository
                    .findByDeletedFalseAndTypeAndCategoryOrderByDateDesc(type, category);
        }

        if (type != null) {
            return transactionRepository
                    .findByDeletedFalseAndTypeOrderByDateDesc(type);
        }

        if (category != null) {
            return transactionRepository
                    .findByDeletedFalseAndCategoryOrderByDateDesc(category);
        }

        return transactionRepository.findByDeletedFalseOrderByDateDesc();
    }

    public Transaction getById(Long id) {
        return transactionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transaction not found: " + id));
    }

    @Transactional
    public Transaction create(TransactionRequest request, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + username));

        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .type(request.getType())
                .category(request.getCategory() != null ? request.getCategory().trim() : null)
                .date(request.getDate())
                .notes(request.getNotes())
                .deleted(false)
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction update(Long id, TransactionRequest request) {

        Transaction existing = getById(id);

        existing.setAmount(request.getAmount());
        existing.setType(request.getType());
        existing.setCategory(request.getCategory() != null ? request.getCategory().trim() : null);
        existing.setDate(request.getDate());
        existing.setNotes(request.getNotes());

        return existing;
    }

    @Transactional
    public void softDelete(Long id) {
        Transaction transaction = getById(id);
        transaction.setDeleted(true);
    }
}