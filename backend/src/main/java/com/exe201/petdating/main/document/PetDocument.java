package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.exe201.petdating.main.domain.PetSpecies;
import com.exe201.petdating.main.domain.HealthStatus;
import java.time.Instant;
import java.util.List;

@Document(collection = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetDocument {
    @Id
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
    private Instant createdAt;
    private Instant updatedAt;
}
