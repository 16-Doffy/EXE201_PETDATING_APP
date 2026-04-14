package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.MessageDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<MessageDocument, String> {
}
