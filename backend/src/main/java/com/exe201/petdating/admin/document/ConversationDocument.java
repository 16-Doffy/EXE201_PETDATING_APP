package com.exe201.petdating.admin.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "conversations")
public class ConversationDocument {

    @Id
    private String id;
    private String matchId;
    private List<String> participantUserIds;
    private String petAId;
    private String petBId;
    private String lastMessage;
    private Instant lastMessageAt;
    private String lastMessageSenderId;
    private Map<String, Integer> unreadCounts;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
