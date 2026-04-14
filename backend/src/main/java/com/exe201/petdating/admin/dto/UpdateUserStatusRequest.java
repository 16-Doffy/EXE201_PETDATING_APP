package com.exe201.petdating.admin.dto;

import com.exe201.petdating.admin.domain.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(@NotNull UserStatus status) {
}
