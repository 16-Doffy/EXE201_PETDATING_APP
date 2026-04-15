package com.exe201.petdating.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowResponse {
    private String id;
    private String followerId;
    private String followingId;
    private String followerName;
    private String followerAvatar;
    private String followingName;
    private String followingAvatar;
    private Boolean isFollowing;
    private Instant createdAt;
}
