package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.PostDocument;
import com.exe201.petdating.main.dto.CreatePostRequest;
import com.exe201.petdating.main.dto.PostResponse;
import com.exe201.petdating.main.repository.PostRepository;
import com.exe201.petdating.main.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    
    public PostResponse createPost(String userId, CreatePostRequest request) {
        PostDocument post = PostDocument.builder()
            .userId(userId)
            .petId(request.getPetId())
            .content(request.getContent())
            .imageUrl(request.getImageUrl())
            .likesCount(0L)
            .commentsCount(0L)
            .isActive(true)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
        
        PostDocument savedPost = postRepository.save(post);
        return convertToResponse(savedPost, userId);
    }
    
    public PostResponse getPostById(String postId, String currentUserId) {
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToResponse(post, currentUserId);
    }
    
    public List<PostResponse> getFeed(String currentUserId) {
        return postRepository.findByIsActiveTrueOrderByCreatedAtDesc()
            .stream()
            .map(post -> convertToResponse(post, currentUserId))
            .collect(Collectors.toList());
    }
    
    public PostResponse updatePost(String postId, CreatePostRequest request, String userId) {
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (request.getContent() != null) post.setContent(request.getContent());
        if (request.getImageUrl() != null) post.setImageUrl(request.getImageUrl());
        post.setUpdatedAt(Instant.now());
        
        PostDocument updatedPost = postRepository.save(post);
        return convertToResponse(updatedPost, userId);
    }
    
    public void deletePost(String postId, String userId) {
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        post.setIsActive(false);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
    }
    
    private PostResponse convertToResponse(PostDocument post, String currentUserId) {
        boolean likedByMe = likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());
        
        return PostResponse.builder()
            .id(post.getId())
            .userId(post.getUserId())
            .petId(post.getPetId())
            .content(post.getContent())
            .imageUrl(post.getImageUrl())
            .likesCount(post.getLikesCount())
            .commentsCount(post.getCommentsCount())
            .likedByMe(likedByMe)
            .build();
    }
}
