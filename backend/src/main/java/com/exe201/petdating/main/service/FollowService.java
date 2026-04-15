package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.FollowDocument;
import com.exe201.petdating.main.document.UserDocument;
import com.exe201.petdating.main.dto.FollowResponse;
import com.exe201.petdating.main.repository.FollowRepository;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    /**
     * Follow a user
     */
    public FollowResponse followUser(String followerId, String followingId) {
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new IllegalArgumentException("Already following this user");
        }

        UserDocument follower = userRepository.findById(followerId)
            .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));
        
        UserDocument following = userRepository.findById(followingId)
            .orElseThrow(() -> new IllegalArgumentException("Following user not found"));

        FollowDocument follow = FollowDocument.builder()
            .followerId(followerId)
            .followingId(followingId)
            .followerName(follower.getName())
            .followerAvatar(follower.getAvatar())
            .followingName(following.getName())
            .followingAvatar(following.getAvatar())
            .createdAt(Instant.now())
            .build();

        FollowDocument saved = followRepository.save(follow);
        return toResponse(saved);
    }

    /**
     * Unfollow a user
     */
    public void unfollowUser(String followerId, String followingId) {
        FollowDocument follow = followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .orElseThrow(() -> new IllegalArgumentException("Not following this user"));
        
        followRepository.delete(follow);
    }

    /**
     * Check if user follows another user
     */
    public Boolean isFollowing(String followerId, String followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    /**
     * Get user's followers
     */
    public List<FollowResponse> getFollowers(String userId) {
        return followRepository.findByFollowingId(userId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get user's following list
     */
    public List<FollowResponse> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get follower count
     */
    public Long getFollowerCount(String userId) {
        return followRepository.countByFollowingId(userId);
    }

    /**
     * Get following count
     */
    public Long getFollowingCount(String userId) {
        return followRepository.countByFollowerId(userId);
    }

    /**
     * Convert FollowDocument to FollowResponse
     */
    private FollowResponse toResponse(FollowDocument follow) {
        return FollowResponse.builder()
            .id(follow.getId())
            .followerId(follow.getFollowerId())
            .followingId(follow.getFollowingId())
            .followerName(follow.getFollowerName())
            .followerAvatar(follow.getFollowerAvatar())
            .followingName(follow.getFollowingName())
            .followingAvatar(follow.getFollowingAvatar())
            .isFollowing(true)
            .createdAt(follow.getCreatedAt())
            .build();
    }
}
