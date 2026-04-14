package com.exe201.petdating.admin.dto;

import com.exe201.petdating.admin.domain.UserStatus;

import java.time.Instant;
import java.util.List;

public record AdminUserResponse(
        String id,
        String username,
        String email,
        String name,
        String avatarUrl,
        String phone,
        List<String> roles,
        UserStatus status,
        Boolean hasCompletedOnboarding,
        Instant lastActiveAt,
        String city,
        String district,
        Instant createdAt,
        Instant updatedAt
) {
}
