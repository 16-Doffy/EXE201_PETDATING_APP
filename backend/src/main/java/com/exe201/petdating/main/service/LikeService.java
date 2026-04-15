package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.LikeDocument;
import com.exe201.petdating.main.document.PostDocument;
import com.exe201.petdating.main.document.UserDocument;
import com.exe201.petdating.main.dto.LikeResponse;
import com.exe201.petdating.main.repository.LikeRepository;
import com.exe201.petdating.main.repository.PostRepository;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public LikeResponse likePost(String userId, String postId) {
        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new IllegalArgumentException("Already liked this post");
        }
        
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        
        UserDocument user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        LikeDocument like = LikeDocument.builder()
            .userId(userId)
            .postId(postId)
            .createdAt(Instant.now())
            .build();
        
        LikeDocument saved = likeRepository.save(like);
        
        post.setLikesCount((post.getLikesCount() != null ? post.getLikesCount() : 0) + 1);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
        
        return toResponse(saved, user);
    }
    
    public void unlikePost(String userId, String postId) {
        LikeDocument like = likeRepository.findByUserIdAndPostId(userId, postId)
            .orElseThrow(() -> new IllegalArgumentException("Like not found"));
        
        PostDocument post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        
        likeRepository.delete(like);
        
        post.setLikesCount(Math.max(0, (post.getLikesCount() != null ? post.getLikesCount() : 1) - 1));
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);
    }
    
    public Boolean hasLiked(String userId, String postId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }
    
    public List<LikeResponse> getPostLikes(String postId) {
        return likeRepository.findByPostId(postId)
            .stream()
            .map(like -> {
                UserDocument user = userRepository.findById(like.getUserId()).orElse(null);
                return toResponse(like, user);
            })
            .collect(Collectors.toList());
    }
    
    public List<LikeResponse> getUserLikedPosts(String userId) {
        return likeRepository.findByUserId(userId)
            .stream()
            .map(like -> {
                UserDocument user = userRepository.findById(userId).orElse(null);
                return toResponse(like, user);
            })
            .collect(Collectors.toList());
    }
    
    public Long getPostLikeCount(String postId) {
        return likeRepository.countByPostId(postId);
    }
    
    private LikeResponse toResponse(LikeDocument like, UserDocument user) {
        return LikeResponse.builder()
            .id(like.getId())
            .userId(like.getUserId())
            .postId(like.getPostId())
            .userName(user != null ? user.getName() : "Unknown")
            .userAvatar(user != null ? user.getAvatar() : null)
            .createdAt(like.getCreatedAt())
            .build();
    }
}
