package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.MessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository("adminMessageRepository")
public interface MessageRepository extends MongoRepository<MessageDocument, String> {
}
