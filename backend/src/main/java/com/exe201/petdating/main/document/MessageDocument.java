package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDocument {
    @Id
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String imageUrl;
    private Boolean isRead;
    private Instant createdAt;
}
