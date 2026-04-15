package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.SubscriptionDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends MongoRepository<SubscriptionDocument, String> {
    Optional<SubscriptionDocument> findByUserId(String userId);
    
    @Query("{ 'userId': ?0, 'isActive': true }")
    Optional<SubscriptionDocument> findActiveByUserId(String userId);
    
    @Query("{ 'isActive': true }")
    List<SubscriptionDocument> findAllActive();
}
