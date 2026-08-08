package org.fta.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.fta.entities.UserRole;
import org.fta.entities.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetails extends Users implements UserDetails {

  private final String userName;
  private final String password;

  private final Collection<? extends GrantedAuthority> authorities;

  public CustomUserDetails(String userName, String password,
      Set<UserRole> roles) {
    this.userName = userName;
    this.password = password;
    List<GrantedAuthority> auths = new ArrayList<>();
    for (UserRole role : roles) {
      auths.add(new SimpleGrantedAuthority(role.getName().toUpperCase()));
    }
    this.authorities = auths;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return userName;
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;
    CustomUserDetails that = (CustomUserDetails) o;
    return userName.equals(that.userName) &&
        password.equals(that.password) &&
        authorities.equals(that.authorities);
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), userName, password, authorities);
  }
}
