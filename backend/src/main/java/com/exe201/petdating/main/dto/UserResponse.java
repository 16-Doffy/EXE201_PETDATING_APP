package com.exe201.petdating.main.dto;

import lombok.*;
import com.exe201.petdating.main.domain.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String phone;
    private String name;
    private String avatar;
    private String bio;
    private String location;
    private UserRole role;
    private Boolean isVerified;
}
