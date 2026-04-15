package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.PetDocument;
import com.exe201.petdating.admin.domain.PetStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("adminPetRepository")
public interface PetRepository extends MongoRepository<PetDocument, String> {

    List<PetDocument> findByStatus(PetStatus status);

    long countByIsVisibleTrue();

    long countByStatus(PetStatus status);
}
