package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.UserDocument;
import com.exe201.petdating.main.domain.UserRole;
import com.exe201.petdating.main.dto.SignupRequest;
import com.exe201.petdating.main.dto.LoginRequest;
import com.exe201.petdating.main.dto.UserResponse;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        UserDocument user = UserDocument.builder()
            .email(request.getEmail())
            .phone(request.getPhone())
            .name(request.getName())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .isActive(true)
            .isVerified(false)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
        
        UserDocument savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }
    
    public Optional<UserDocument> login(LoginRequest request) {
        Optional<UserDocument> user = userRepository.findByEmail(request.getEmail());
        if (user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPasswordHash())) {
            return user;
        }
        return Optional.empty();
    }
    
    public Optional<UserDocument> getUserById(String userId) {
        return userRepository.findById(userId);
    }
    
    private UserResponse convertToResponse(UserDocument user) {
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .phone(user.getPhone())
            .name(user.getName())
            .avatar(user.getAvatar())
            .bio(user.getBio())
            .location(user.getLocation())
            .role(user.getRole())
            .isVerified(user.getIsVerified())
            .build();
    }
}
