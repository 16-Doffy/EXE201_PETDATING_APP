package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePostRequest {
    @NotBlank(message = "Pet ID is required")
    private String petId;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 1000, message = "Content must be between 1-1000 characters")
    private String content;
    
    @Size(max = 500, message = "Image URL cannot exceed 500 characters")
    private String imageUrl;
}
