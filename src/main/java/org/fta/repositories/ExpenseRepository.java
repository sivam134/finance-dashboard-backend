package org.fta.repositories;

import org.fta.entities.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expenses, String> {
}
