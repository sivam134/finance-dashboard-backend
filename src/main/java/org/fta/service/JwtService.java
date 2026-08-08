package org.fta.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  @Value("${spring.security.jwt.secret}")
  public String secret;

  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  public String generateToken(String username){
    Map<String, Object> claims = new HashMap<>();
    return createToken(claims, username);
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject); // claims -> claims.getSubject()
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {  // Function<Claims, String> claimsResolver = claims -> claims.getSubject(); OR Function<Claims, String> claimsResolver = claims -> claims.getExpiration()
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims); // apply just performs the lambda function.
  }

  private Claims extractAllClaims(String token) {
    return Jwts
        .parser()
        .verifyWith(getSignKey())
        .build().parseSignedClaims(token).getPayload();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }


  private String createToken(Map<String, Object> claims, String username) {
    return Jwts.builder().claims(claims).subject(username)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis()+ (1000 * 60)))
        .signWith(getSignKey()).compact();
  }

  private SecretKey getSignKey() {
    byte[] keyBytes = Decoders.BASE64.decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
