package com.exe201.petdating.admin.dto;

public record AdminDashboardResponse(
        long totalUsers,
        long activeUsers,
        long suspendedUsers,
        long totalPets,
        long visiblePets,
        long totalMatches,
        long totalConversations,
        long totalMessages
) {
}
