package com.exe201.petdating.admin.dto;

import com.exe201.petdating.admin.domain.PetStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePetModerationRequest(
        @NotNull Boolean isVisible,
        @NotNull PetStatus status
) {
}
