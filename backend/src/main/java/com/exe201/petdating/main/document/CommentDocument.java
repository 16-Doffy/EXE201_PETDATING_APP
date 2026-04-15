package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDocument {
    @Id
    private String id;
    private String userId;
    private String postId;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}
