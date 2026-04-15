package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipRequest {
    @NotBlank(message = "User ID is required")
    private String userId;
}
