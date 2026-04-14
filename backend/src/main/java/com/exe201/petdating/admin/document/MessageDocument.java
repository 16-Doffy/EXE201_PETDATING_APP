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
@Document(collection = "messages")
public class MessageDocument {

    @Id
    private String id;
    private String conversationId;
    private String senderUserId;
    private String text;
    private String type;
    private String status;
    private Instant createdAt;
}
