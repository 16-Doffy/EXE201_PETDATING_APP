package com.exe201.petdating.main.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private String id;
    private String userId;
    private String postId;
    private String content;
    private String userName;
    private String userAvatar;
}
