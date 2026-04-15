package com.exe201.petdating.admin.repository;

import com.exe201.petdating.admin.document.MatchDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository("adminMatchRepository")
public interface MatchRepository extends MongoRepository<MatchDocument, String> {
}
