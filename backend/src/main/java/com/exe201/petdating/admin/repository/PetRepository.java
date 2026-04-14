package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.PetDocument;
import com.exe201.petdating.admin.domain.PetStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PetRepository extends MongoRepository<PetDocument, String> {

    List<PetDocument> findByStatus(PetStatus status);

    long countByIsVisibleTrue();

    long countByStatus(PetStatus status);
}
