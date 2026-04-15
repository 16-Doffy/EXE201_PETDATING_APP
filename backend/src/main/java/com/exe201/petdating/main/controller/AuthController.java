package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.AuthService;
import com.exe201.petdating.main.service.JwtTokenProvider;
import com.exe201.petdating.main.document.UserDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            UserResponse userResponse = authService.signup(request);
            String token = jwtTokenProvider.generateToken(userResponse.getId());
            AuthResponse authResponse = AuthResponse.builder()
                .accessToken(token)
                .user(userResponse)
                .build();
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<UserDocument> user = authService.login(request);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Invalid credentials", null));
            }
            
            UserDocument userDoc = user.get();
            UserResponse userResponse = convertToResponse(userDoc);
            String token = jwtTokenProvider.generateToken(userDoc.getId());
            
            AuthResponse authResponse = AuthResponse.builder()
                .accessToken(token)
                .user(userResponse)
                .build();
            
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<UserDocument> user = authService.getUserById(userId);
            
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(convertToResponse(user.get()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
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
