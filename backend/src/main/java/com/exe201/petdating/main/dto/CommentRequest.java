package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRequest {
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 500, message = "Comment must be between 1-500 characters")
    private String content;
}
