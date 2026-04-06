package com.finance.dashboard.service;

import com.finance.dashboard.exception.ResourceNotFoundException;
import com.finance.dashboard.model.Role;
import com.finance.dashboard.model.User;
import com.finance.dashboard.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + id));
    }

    @Transactional
    public User updateRole(Long id, Role newRole) {
        User user = getUserById(id);
        user.setRole(newRole);
        return user;
    }

    @Transactional
    public User toggleStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return user;
    }
}