package com.exe201.petdating.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private String id;
    private String conversationId;
    private String senderId;
    private String senderName;
    private String senderAvatar;
    private String text;
    private String type; // "TEXT", "IMAGE", "FILE"
    private String status; // "SENT", "DELIVERED", "READ"
    private Instant createdAt;
    private Long reactions; // emoji count
}
