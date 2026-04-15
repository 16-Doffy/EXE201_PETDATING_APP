package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.FriendshipService;
import com.exe201.petdating.main.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/friendships")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService friendshipService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendFriendRequest(@Valid @RequestBody FriendshipRequest request) {
        try {
            String senderId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            FriendshipResponse friendshipResponse = friendshipService.sendFriendRequest(senderId, request.getUserId());
            return ResponseEntity.ok(friendshipResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{requestId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> acceptRequest(@PathVariable String requestId) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            FriendshipResponse friendshipResponse = friendshipService.acceptRequest(userId, requestId);
            return ResponseEntity.ok(friendshipResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{requestId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> rejectRequest(@PathVariable String requestId) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            friendshipService.rejectRequest(userId, requestId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Request rejected successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/matches")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMatches() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<FriendshipResponse> matches = friendshipService.getMatches(userId);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPendingRequests() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<FriendshipResponse> pending = friendshipService.getPendingRequests(userId);
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
