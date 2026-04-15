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
public class LikeResponse {
    private String id;
    private String userId;
    private String postId;
    private String userName;
    private String userAvatar;
    private Instant createdAt;
}
