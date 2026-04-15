package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpgradeSubscriptionRequest {
    @NotBlank(message = "Plan name is required")
    private String planName;
}
