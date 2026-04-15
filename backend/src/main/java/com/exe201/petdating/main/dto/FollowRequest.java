package com.exe201.petdating.main.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FollowRequest {
    @NotBlank(message = "User ID to follow is required")
    private String userId;
}
