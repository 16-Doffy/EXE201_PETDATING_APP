package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.UserDocument;
import com.exe201.petdating.admin.domain.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<UserDocument, String> {

    List<UserDocument> findByStatus(UserStatus status);

    long countByStatus(UserStatus status);
}
