package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.MessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<MessageDocument, String> {
    @Query("{ $or: [ { 'senderId': ?0, 'receiverId': ?1 }, { 'senderId': ?1, 'receiverId': ?0 } ] }")
    List<MessageDocument> findConversation(String userId1, String userId2);
    
    List<MessageDocument> findByReceiverId(String receiverId);
    List<MessageDocument> findBySenderId(String senderId);
    Long countByReceiverIdAndIsReadFalse(String receiverId);
}
