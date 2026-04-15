package com.exe201.petdating.main.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9\\-\\+\\s\\(\\)]*$", message = "Phone number is invalid")
    private String phone;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 50, message = "Password must be between 6-50 characters")
    private String password;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2-100 characters")
    private String name;
}

