package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {
    private final LikeService likeService;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LikeResponse>> likePost(@Valid @RequestBody LikeRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            LikeResponse response = likeService.likePost(userId, request.getPostId());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Post liked successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to like post", null));
        }
    }
    
    @DeleteMapping("/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> unlikePost(@PathVariable String postId) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            likeService.unlikePost(userId, postId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Post unliked successfully", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to unlike post", null));
        }
    }
    
    @GetMapping("/check/{postId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Boolean>> hasLiked(@PathVariable String postId) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Boolean liked = likeService.hasLiked(userId, postId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Check complete", liked));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to check like status", null));
        }
    }
    
    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<List<LikeResponse>>> getPostLikes(@PathVariable String postId) {
        try {
            List<LikeResponse> likes = likeService.getPostLikes(postId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Likes retrieved successfully", likes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve likes", null));
        }
    }
    
    @GetMapping("/user/posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LikeResponse>>> getUserLikedPosts() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<LikeResponse> likes = likeService.getUserLikedPosts(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "User liked posts retrieved", likes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Failed to retrieve user liked posts", null));
        }
    }
}
