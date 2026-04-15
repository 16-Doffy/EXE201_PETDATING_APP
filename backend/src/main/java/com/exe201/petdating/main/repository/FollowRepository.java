package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.FollowDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<FollowDocument, String> {
    
    Optional<FollowDocument> findByFollowerIdAndFollowingId(String followerId, String followingId);
    
    boolean existsByFollowerIdAndFollowingId(String followerId, String followingId);
    
    List<FollowDocument> findByFollowerId(String followerId);
    
    List<FollowDocument> findByFollowingId(String followingId);
    
    long countByFollowerId(String followerId);
    
    long countByFollowingId(String followingId);
}
