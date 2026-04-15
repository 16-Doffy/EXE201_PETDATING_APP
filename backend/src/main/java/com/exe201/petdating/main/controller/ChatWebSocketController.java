package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.ChatMessageDto;
import com.exe201.petdating.main.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
@MessageMapping("/chat")
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    /**
     * Handle incoming chat messages
     * Client sends to: /app/chat/send/{conversationId}
     * Server broadcasts to: /topic/chat/{conversationId}
     */
    @MessageMapping("/send/{conversationId}")
    public void sendMessage(@DestinationVariable String conversationId,
                           @Payload ChatMessageDto message) {
        try {
            log.info("Received message for conversation: {}", conversationId);
            
            // Set message metadata
            message.setId(UUID.randomUUID().toString());
            message.setConversationId(conversationId);
            message.setCreatedAt(Instant.now());
            message.setStatus("DELIVERED");
            message.setType(message.getType() != null ? message.getType() : "TEXT");
            
            // Save message to database (async in real app)
            // messageService.saveMessage(message);
            
            // Broadcast to all subscribers of this conversation
            messagingTemplate.convertAndSend(
                "/topic/chat/" + conversationId,
                message
            );
            
            log.info("Message broadcast to conversation: {}", conversationId);
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            
            // Send error message back to sender
            ChatMessageDto errorMsg = new ChatMessageDto();
            errorMsg.setStatus("ERROR");
            errorMsg.setText("Failed to send message: " + e.getMessage());
            messagingTemplate.convertAndSend(
                "/user/" + message.getSenderId() + "/queue/errors",
                errorMsg
            );
        }
    }

    /**
     * Handle typing indicator
     * Client sends to: /app/chat/typing/{conversationId}/{userId}
     */
    @MessageMapping("/typing/{conversationId}/{userId}")
    public void handleTyping(@DestinationVariable String conversationId,
                            @DestinationVariable String userId) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/typing/" + conversationId,
                new TypingIndicatorDto(userId, true)
            );
        } catch (Exception e) {
            log.error("Error sending typing indicator: {}", e.getMessage());
        }
    }

    /**
     * Handle stop typing
     */
    @MessageMapping("/stop-typing/{conversationId}/{userId}")
    public void handleStopTyping(@DestinationVariable String conversationId,
                                @DestinationVariable String userId) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/typing/" + conversationId,
                new TypingIndicatorDto(userId, false)
            );
        } catch (Exception e) {
            log.error("Error sending stop typing indicator: {}", e.getMessage());
        }
    }

    /**
     * Handle message read status
     */
    @MessageMapping("/read/{conversationId}/{messageId}")
    public void handleMessageRead(@DestinationVariable String conversationId,
                                 @DestinationVariable String messageId,
                                 @Payload String userId) {
        try {
            messagingTemplate.convertAndSend(
                "/topic/read/" + conversationId,
                new MessageReadDto(messageId, userId, Instant.now())
            );
        } catch (Exception e) {
            log.error("Error sending read status: {}", e.getMessage());
        }
    }

    // Helper DTOs
    public record TypingIndicatorDto(String userId, boolean isTyping) {}
    public record MessageReadDto(String messageId, String userId, Instant readAt) {}
}
