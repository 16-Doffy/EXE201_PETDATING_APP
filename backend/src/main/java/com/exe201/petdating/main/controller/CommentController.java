package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.CommentService;
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
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(@PathVariable String postId,
                                        @Valid @RequestBody CommentRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            CommentResponse commentResponse = commentService.addComment(userId, postId, request);
            return ResponseEntity.ok(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getComments(@PathVariable String postId) {
        try {
            List<CommentResponse> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteComment(@PathVariable String postId,
                                           @PathVariable String commentId) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            commentService.deleteComment(commentId, userId, postId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Comment deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
