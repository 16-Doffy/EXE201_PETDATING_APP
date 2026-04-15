package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.exe201.petdating.main.domain.FriendshipStatus;
import java.time.Instant;

@Document(collection = "friendships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipDocument {
    @Id
    private String id;
    private String user1Id;
    private String user2Id;
    private FriendshipStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
