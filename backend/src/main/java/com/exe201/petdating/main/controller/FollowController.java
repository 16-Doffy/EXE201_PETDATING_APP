package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.ApiResponse;
import com.exe201.petdating.main.dto.FollowRequest;
import com.exe201.petdating.main.dto.FollowResponse;
import com.exe201.petdating.main.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    /**
     * Follow a user
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FollowResponse>> followUser(@Valid @RequestBody FollowRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            FollowResponse response = followService.followUser(userId, request.getUserId());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "User followed successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to follow user", null));
        }
    }

    /**
     * Unfollow a user
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> unfollowUser(@PathVariable String userId) {
        try {
            String followerId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            followService.unfollowUser(followerId, userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User unfollowed successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to unfollow user", null));
        }
    }

    /**
     * Check if user follows another user
     */
    @GetMapping("/check/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> isFollowing(@PathVariable String userId) {
        try {
            String followerId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Boolean isFollowing = followService.isFollowing(followerId, userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Check complete", isFollowing));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to check follow status", null));
        }
    }

    /**
     * Get user's followers
     */
    @GetMapping("/followers/{userId}")
    public ResponseEntity<ApiResponse<List<FollowResponse>>> getFollowers(@PathVariable String userId) {
        try {
            List<FollowResponse> followers = followService.getFollowers(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Followers retrieved successfully", followers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve followers", null));
        }
    }

    /**
     * Get user's following list
     */
    @GetMapping("/following/{userId}")
    public ResponseEntity<ApiResponse<List<FollowResponse>>> getFollowing(@PathVariable String userId) {
        try {
            List<FollowResponse> following = followService.getFollowing(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Following retrieved successfully", following));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve following list", null));
        }
    }

    /**
     * Get follower count
     */
    @GetMapping("/count/followers/{userId}")
    public ResponseEntity<ApiResponse<Long>> getFollowerCount(@PathVariable String userId) {
        try {
            Long count = followService.getFollowerCount(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Follower count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve follower count", null));
        }
    }

    /**
     * Get following count
     */
    @GetMapping("/count/following/{userId}")
    public ResponseEntity<ApiResponse<Long>> getFollowingCount(@PathVariable String userId) {
        try {
            Long count = followService.getFollowingCount(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Following count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve following count", null));
        }
    }
}
