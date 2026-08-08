package org.fta.repositories;

import java.util.Optional;
import org.fta.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
  public Optional<Users> findByUsername(String username);
}
