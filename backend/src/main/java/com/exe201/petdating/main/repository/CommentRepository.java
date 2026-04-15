package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.CommentDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<CommentDocument, String> {
    List<CommentDocument> findByPostId(String postId);
    List<CommentDocument> findByUserId(String userId);
    Long countByPostId(String postId);
}
