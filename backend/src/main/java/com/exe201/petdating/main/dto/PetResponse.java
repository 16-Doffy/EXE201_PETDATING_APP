package com.exe201.petdating.main.dto;

import lombok.*;
import com.exe201.petdating.main.domain.PetSpecies;
import com.exe201.petdating.main.domain.HealthStatus;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponse {
    private String id;
    private String userId;
    private String name;
    private PetSpecies species;
    private String breed;
    private Double weight;
    private Integer age;
    private HealthStatus healthStatus;
    private List<String> photos;
    private String bio;
    private Boolean isActive;
}
