package com.exe201.petdating.admin.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "matches")
public class MatchDocument {

    @Id
    private String id;
    private String userAId;
    private String userBId;
    private String petAId;
    private String petBId;
    private String conversationId;
    private String status;
    private Instant matchedAt;
    private Instant createdAt;
}
