package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.exe201.petdating.main.domain.UserRole;
import java.time.Instant;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDocument {
    @Id
    private String id;
    private String email;
    private String phone;
    private String passwordHash;
    private String name;
    private String avatar;
    private String bio;
    private String location;
    private UserRole role;
    private Boolean isActive;
    private Boolean isVerified;
    private Instant createdAt;
    private Instant updatedAt;
}
