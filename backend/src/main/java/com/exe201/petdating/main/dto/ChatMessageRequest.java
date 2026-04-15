package com.exe201.petdating.main.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Real-time Chat Message DTO for WebSocket communication
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    private String receiverId;
    private String content;
    private String imageUrl;
    private LocalDateTime timestamp;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class ChatMessageResponse {
    private String id;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String content;
    private String imageUrl;
    private boolean isRead;
    private LocalDateTime timestamp;
}
