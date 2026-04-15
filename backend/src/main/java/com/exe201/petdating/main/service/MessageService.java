package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.MessageDocument;
import com.exe201.petdating.main.dto.MessageRequest;
import com.exe201.petdating.main.dto.MessageResponse;
import com.exe201.petdating.main.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    
    public MessageResponse sendMessage(String senderId, String receiverId, MessageRequest request) {
        MessageDocument message = MessageDocument.builder()
            .senderId(senderId)
            .receiverId(receiverId)
            .content(request.getContent())
            .imageUrl(request.getImageUrl())
            .isRead(false)
            .createdAt(Instant.now())
            .build();
        
        MessageDocument savedMessage = messageRepository.save(message);
        return convertToResponse(savedMessage);
    }
    
    public List<MessageResponse> getConversation(String userId1, String userId2) {
        return messageRepository.findConversation(userId1, userId2)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<MessageResponse> getReceivedMessages(String receiverId) {
        return messageRepository.findByReceiverId(receiverId)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public void markAsRead(String messageId) {
        MessageDocument message = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    public Long getUnreadCount(String userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }
    
    private MessageResponse convertToResponse(MessageDocument message) {
        return MessageResponse.builder()
            .id(message.getId())
            .senderId(message.getSenderId())
            .receiverId(message.getReceiverId())
            .content(message.getContent())
            .imageUrl(message.getImageUrl())
            .isRead(message.getIsRead())
            .build();
    }
}
