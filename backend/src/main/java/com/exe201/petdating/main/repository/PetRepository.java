package com.exe201.petdating.main.repository;

import com.exe201.petdating.main.document.PetDocument;
import com.exe201.petdating.main.domain.PetSpecies;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends MongoRepository<PetDocument, String> {
    List<PetDocument> findByUserId(String userId);
    List<PetDocument> findBySpecies(PetSpecies species);
    List<PetDocument> findByUserIdAndIsActiveTrue(String userId);
}
