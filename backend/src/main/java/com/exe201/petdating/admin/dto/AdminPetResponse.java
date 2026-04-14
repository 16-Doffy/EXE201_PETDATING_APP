package com.exe201.petdating.admin.dto;

import com.exe201.petdating.admin.domain.PetGender;
import com.exe201.petdating.admin.domain.PetSpecies;
import com.exe201.petdating.admin.domain.PetStatus;

import java.time.Instant;
import java.util.List;

public record AdminPetResponse(
        String id,
        String ownerId,
        String ownerName,
        String name,
        PetSpecies species,
        String breed,
        Integer ageInMonths,
        PetGender gender,
        String bio,
        List<String> traits,
        Boolean isOnline,
        Boolean isVisible,
        PetStatus status,
        String city,
        String district,
        Instant createdAt,
        Instant updatedAt
) {
}
