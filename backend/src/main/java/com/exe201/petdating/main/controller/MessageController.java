package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.MessageService;
import com.exe201.petdating.main.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/{receiverId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendMessage(@PathVariable String receiverId,
                                         @Valid @RequestBody MessageRequest request) {
        try {
            String senderId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            MessageResponse messageResponse = messageService.sendMessage(senderId, receiverId, request);
            return ResponseEntity.ok(messageResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConversation(@PathVariable String userId) {
        try {
            String currentUserId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<MessageResponse> messages = messageService.getConversation(currentUserId, userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getReceivedMessages() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<MessageResponse> messages = messageService.getReceivedMessages(userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUnreadCount() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long count = messageService.getUnreadCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{messageId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable String messageId) {
        try {
            messageService.markAsRead(messageId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Message marked as read", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
