package com.exe201.petdating.main.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String imageUrl;
    private Boolean isRead;
}
