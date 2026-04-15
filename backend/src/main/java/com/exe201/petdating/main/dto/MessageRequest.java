package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 1000, message = "Message must be between 1-1000 characters")
    private String content;
    
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;
}
