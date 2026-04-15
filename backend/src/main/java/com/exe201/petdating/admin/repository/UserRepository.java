package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.UserDocument;
import com.exe201.petdating.admin.domain.UserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("adminUserRepository")
public interface UserRepository extends MongoRepository<UserDocument, String> {

    List<UserDocument> findByStatus(UserStatus status);

    long countByStatus(UserStatus status);

    Optional<UserDocument> findFirstByUsernameIgnoreCaseOrEmailIgnoreCase(String username, String email);
}
