package com.exe201.petdating.main.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
    private String id;
    private String userId;
    private String petId;
    private String content;
    private String imageUrl;
    private Long likesCount;
    private Long commentsCount;
    private Boolean likedByMe;
}
