package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.LikeDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends MongoRepository<LikeDocument, String> {
    List<LikeDocument> findByUserId(String userId);
    List<LikeDocument> findByPostId(String postId);
    Optional<LikeDocument> findByUserIdAndPostId(String userId, String postId);
    boolean existsByUserIdAndPostId(String userId, String postId);
    Long countByPostId(String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
}
