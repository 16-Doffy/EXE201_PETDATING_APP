package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.ConversationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository("adminConversationRepository")
public interface ConversationRepository extends MongoRepository<ConversationDocument, String> {
}
