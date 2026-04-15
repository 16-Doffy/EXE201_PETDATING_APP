package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.FriendshipDocument;
import com.exe201.petdating.main.domain.FriendshipStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends MongoRepository<FriendshipDocument, String> {
    @Query("{ $or: [ { 'user1Id': ?0 }, { 'user2Id': ?0 } ] }")
    List<FriendshipDocument> findByUserId(String userId);
    
    @Query("{ $or: [ { 'user1Id': ?0, 'user2Id': ?1 }, { 'user1Id': ?1, 'user2Id': ?0 } ] }")
    Optional<FriendshipDocument> findBetweenUsers(String userId1, String userId2);
    
    @Query("{ $or: [ { 'user1Id': ?0 }, { 'user2Id': ?0 } ], 'status': ?1 }")
    List<FriendshipDocument> findByUserIdAndStatus(String userId, FriendshipStatus status);
}
