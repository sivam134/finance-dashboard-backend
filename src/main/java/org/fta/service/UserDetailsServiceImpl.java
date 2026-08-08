package org.fta.service;

import java.util.Optional;
import org.fta.entities.Users;
import org.fta.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserRepository userRepository;

  public UserDetailsServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username){
    Optional<Users> users = userRepository.findByUsername(username);
    if(users.isEmpty()){
      throw new UsernameNotFoundException("User not found with username: " + username);
    }
    Users user = users.get();
    return new CustomUserDetails(user.getUsername(), user.getPasswordHash(), user.getRoles());
  }
}
