package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.CommentDocument;
import com.exe201.petdating.main.document.PostDocument;
import com.exe201.petdating.main.dto.CommentRequest;
import com.exe201.petdating.main.dto.CommentResponse;
import com.exe201.petdating.main.repository.CommentRepository;
import com.exe201.petdating.main.repository.PostRepository;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public CommentResponse addComment(String userId, String postId, CommentRequest request) {
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        CommentDocument comment = CommentDocument.builder()
            .userId(userId)
            .postId(postId)
            .content(request.getContent())
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
        
        CommentDocument savedComment = commentRepository.save(comment);
        
        post.setCommentsCount(post.getCommentsCount() + 1);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
        
        return convertToResponse(savedComment);
    }
    
    public List<CommentResponse> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public void deleteComment(String commentId, String userId, String postId) {
        CommentDocument comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        commentRepository.delete(comment);
        
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setCommentsCount(Math.max(0, post.getCommentsCount() - 1));
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
    }
    
    private CommentResponse convertToResponse(CommentDocument comment) {
        var user = userRepository.findById(comment.getUserId()).orElse(null);
        
        return CommentResponse.builder()
            .id(comment.getId())
            .userId(comment.getUserId())
            .postId(comment.getPostId())
            .content(comment.getContent())
            .userName(user != null ? user.getName() : "Unknown")
            .userAvatar(user != null ? user.getAvatar() : null)
            .build();
    }
}
