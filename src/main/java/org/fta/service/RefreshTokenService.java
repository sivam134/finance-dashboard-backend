package org.fta.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.fta.entities.RefreshToken;
import org.fta.entities.Users;
import org.fta.repositories.RefreshTokenRepository;
import org.fta.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService {
  private final RefreshTokenRepository refreshTokenRepository;
  private final UserRepository userRepository;

  public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository){
    this.refreshTokenRepository = refreshTokenRepository;
    this.userRepository = userRepository;
  }

  public void createRefreshToken(String username){
    Optional<Users> user = userRepository.findByUsername(username);
    if(user.isPresent()){
      RefreshToken refreshToken = RefreshToken.builder()
          .user(user.get())
          .token(UUID.randomUUID().toString())
          .expiryDate(Instant.now().plusMillis(6000000)).build();
      refreshTokenRepository.save(refreshToken);
    } else {
      throw new RuntimeException("User not found");
    }
  }

  public void verifyExpiration(RefreshToken refreshToken){
    if(refreshToken.getExpiryDate().compareTo(Instant.now()) < 0){
      refreshTokenRepository.delete(refreshToken);
      throw new RuntimeException("Refresh token expired. Please make a new long ");
    }
  }
}
