package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.FriendshipDocument;
import com.exe201.petdating.main.domain.FriendshipStatus;
import com.exe201.petdating.main.dto.FriendshipResponse;
import com.exe201.petdating.main.repository.FriendshipRepository;
import com.exe201.petdating.main.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.time.Instant;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    
    public FriendshipResponse sendFriendRequest(String senderId, String receiverId) {
        Optional<FriendshipDocument> existing = friendshipRepository.findBetweenUsers(senderId, receiverId);
        if (existing.isPresent()) {
            throw new RuntimeException("Friendship already exists");
        }
        
        FriendshipDocument friendship = FriendshipDocument.builder()
            .user1Id(senderId)
            .user2Id(receiverId)
            .status(FriendshipStatus.PENDING)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
        
        FriendshipDocument savedFriendship = friendshipRepository.save(friendship);
        return convertToResponse(savedFriendship);
    }
    
    public FriendshipResponse acceptRequest(String userId, String requestId) {
        FriendshipDocument friendship = friendshipRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friendship not found"));
        
        if (!friendship.getUser2Id().equals(userId) && !friendship.getUser1Id().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendship.setUpdatedAt(Instant.now());
        
        FriendshipDocument updatedFriendship = friendshipRepository.save(friendship);
        return convertToResponse(updatedFriendship);
    }
    
    public void rejectRequest(String userId, String requestId) {
        FriendshipDocument friendship = friendshipRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Friendship not found"));
        
        if (!friendship.getUser2Id().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        friendship.setStatus(FriendshipStatus.REJECTED);
        friendship.setUpdatedAt(Instant.now());
        friendshipRepository.save(friendship);
    }
    
    public List<FriendshipResponse> getMatches(String userId) {
        return friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.ACCEPTED)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<FriendshipResponse> getPendingRequests(String userId) {
        return friendshipRepository.findByUserIdAndStatus(userId, FriendshipStatus.PENDING)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    private FriendshipResponse convertToResponse(FriendshipDocument friendship) {
        var user1 = userRepository.findById(friendship.getUser1Id()).orElse(null);
        var user2 = userRepository.findById(friendship.getUser2Id()).orElse(null);
        
        return FriendshipResponse.builder()
            .id(friendship.getId())
            .user1Id(friendship.getUser1Id())
            .user2Id(friendship.getUser2Id())
            .status(friendship.getStatus())
            .user1Name(user1 != null ? user1.getName() : "Unknown")
            .user1Avatar(user1 != null ? user1.getAvatar() : null)
            .user2Name(user2 != null ? user2.getName() : "Unknown")
            .user2Avatar(user2 != null ? user2.getAvatar() : null)
            .build();
    }
}
