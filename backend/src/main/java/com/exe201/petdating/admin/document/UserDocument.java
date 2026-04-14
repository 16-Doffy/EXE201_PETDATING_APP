package com.exe201.petdating.admin.document;

import com.exe201.petdating.admin.domain.UserStatus;
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
@Document(collection = "users")
public class UserDocument {

    @Id
    private String id;
    private String username;
    private String email;
    private String passwordHash;
    private String name;
    private String avatarUrl;
    private String phone;
    private List<String> roles;
    private UserStatus status;
    private Boolean hasCompletedOnboarding;
    private Instant lastActiveAt;
    private GeoPoint location;
    private String city;
    private String district;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeoPoint {
        private String type;
        private List<Double> coordinates;
    }
}
