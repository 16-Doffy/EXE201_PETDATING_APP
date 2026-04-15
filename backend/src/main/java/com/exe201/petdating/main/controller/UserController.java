package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.AuthService;
import com.exe201.petdating.main.service.JwtTokenProvider;
import com.exe201.petdating.main.document.UserDocument;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            Optional<UserDocument> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(convertToResponse(user.get()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/profile/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<UserDocument> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(convertToResponse(user.get()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserResponse updateRequest) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<UserDocument> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            UserDocument user = userOpt.get();
            if (updateRequest.getName() != null) user.setName(updateRequest.getName());
            if (updateRequest.getAvatar() != null) user.setAvatar(updateRequest.getAvatar());
            if (updateRequest.getBio() != null) user.setBio(updateRequest.getBio());
            if (updateRequest.getLocation() != null) user.setLocation(updateRequest.getLocation());
            
            UserDocument updatedUser = userRepository.save(user);
            return ResponseEntity.ok(convertToResponse(updatedUser));
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
