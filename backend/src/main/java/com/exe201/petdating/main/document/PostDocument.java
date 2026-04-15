package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDocument {
    @Id
    private String id;
    private String userId;
    private String petId;
    private String content;
    private String imageUrl;
    private Long likesCount;
    private Long commentsCount;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
