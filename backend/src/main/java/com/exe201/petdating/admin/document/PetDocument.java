package com.exe201.petdating.admin.document;

import com.exe201.petdating.admin.domain.PetGender;
import com.exe201.petdating.admin.domain.PetSpecies;
import com.exe201.petdating.admin.domain.PetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pets")
public class PetDocument {

    @Id
    private String id;
    private String ownerId;
    private OwnerSnapshot ownerSnapshot;
    private String name;
    private PetSpecies species;
    private String breed;
    private Integer ageInMonths;
    private PetGender gender;
    private String bio;
    private List<String> traits;
    private List<String> personalityTags;
    private List<String> favoriteActivities;
    private String vaccineStatus;
    private List<String> photos;
    private List<String> gallery;
    private GeoPoint location;
    private String city;
    private String district;
    private Boolean isOnline;
    private Boolean isVisible;
    private PetStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerSnapshot {
        private String id;
        private String name;
        private String avatarUrl;
        private String phone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeoPoint {
        private String type;
        private List<Double> coordinates;
    }
}
