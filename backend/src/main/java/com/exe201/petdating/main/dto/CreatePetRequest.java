package com.exe201.petdating.main.dto;

import lombok.*;
import com.exe201.petdating.main.domain.PetSpecies;
import com.exe201.petdating.main.domain.HealthStatus;
import jakarta.validation.constraints.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePetRequest {
    @NotBlank(message = "Pet name is required")
    @Size(min = 1, max = 50, message = "Pet name must be between 1-50 characters")
    private String name;
    
    @NotNull(message = "Pet species is required")
    private PetSpecies species;
    
    @NotBlank(message = "Breed is required")
    @Size(min = 1, max = 50, message = "Breed must be between 1-50 characters")
    private String breed;
    
    @DecimalMin(value = "0.1", message = "Weight must be greater than 0")
    @DecimalMax(value = "500.0", message = "Weight cannot exceed 500 kg")
    private Double weight;
    
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 50, message = "Age cannot exceed 50 years")
    private Integer age;
    
    @NotNull(message = "Health status is required")
    private HealthStatus healthStatus;
    
    private List<@NotBlank(message = "Photo URL cannot be blank") String> photos;
    
    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;
}

