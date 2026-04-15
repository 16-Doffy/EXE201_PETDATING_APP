package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "followers")
@CompoundIndexes({
    @CompoundIndex(name = "follower_following_idx", def = "{'followerId': 1, 'followingId': 1}", unique = true),
    @CompoundIndex(name = "following_idx", def = "{'followingId': 1}"),
    @CompoundIndex(name = "follower_idx", def = "{'followerId': 1}")
})
public class FollowDocument {
    
    @Id
    private String id;
    
    private String followerId;
    
    private String followingId;
    
    private String followerName;
    
    private String followerAvatar;
    
    private String followingName;
    
    private String followingAvatar;
    
    private Instant createdAt;
}
