package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.PostDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<PostDocument, String> {
    List<PostDocument> findByUserId(String userId);
    List<PostDocument> findByPetId(String petId);
    List<PostDocument> findByIsActiveTrueOrderByCreatedAtDesc();
}
