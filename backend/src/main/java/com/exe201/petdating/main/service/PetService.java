package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.PetDocument;
import com.exe201.petdating.main.dto.CreatePetRequest;
import com.exe201.petdating.main.dto.PetResponse;
import com.exe201.petdating.main.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {
    private final PetRepository petRepository;
    
    public PetResponse createPet(String userId, CreatePetRequest request) {
        PetDocument pet = PetDocument.builder()
            .userId(userId)
            .name(request.getName())
            .species(request.getSpecies())
            .breed(request.getBreed())
            .weight(request.getWeight())
            .age(request.getAge())
            .healthStatus(request.getHealthStatus())
            .photos(request.getPhotos())
            .bio(request.getBio())
            .isActive(true)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
        
        PetDocument savedPet = petRepository.save(pet);
        return convertToResponse(savedPet);
    }
    
    public PetResponse getPetById(String petId) {
        PetDocument pet = petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));
        return convertToResponse(pet);
    }
    
    public List<PetResponse> getPetsByUserId(String userId) {
        return petRepository.findByUserIdAndIsActiveTrue(userId)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public PetResponse updatePet(String petId, CreatePetRequest request) {
        PetDocument pet = petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (request.getName() != null) pet.setName(request.getName());
        if (request.getBreed() != null) pet.setBreed(request.getBreed());
        if (request.getWeight() != null) pet.setWeight(request.getWeight());
        if (request.getAge() != null) pet.setAge(request.getAge());
        if (request.getHealthStatus() != null) pet.setHealthStatus(request.getHealthStatus());
        if (request.getPhotos() != null) pet.setPhotos(request.getPhotos());
        if (request.getBio() != null) pet.setBio(request.getBio());
        pet.setUpdatedAt(Instant.now());
        
        PetDocument updatedPet = petRepository.save(pet);
        return convertToResponse(updatedPet);
    }
    
    public void deletePet(String petId) {
        PetDocument pet = petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));
        pet.setIsActive(false);
        pet.setUpdatedAt(Instant.now());
        petRepository.save(pet);
    }
    
    private PetResponse convertToResponse(PetDocument pet) {
        return PetResponse.builder()
            .id(pet.getId())
            .userId(pet.getUserId())
            .name(pet.getName())
            .species(pet.getSpecies())
            .breed(pet.getBreed())
            .weight(pet.getWeight())
            .age(pet.getAge())
            .healthStatus(pet.getHealthStatus())
            .photos(pet.getPhotos())
            .bio(pet.getBio())
            .isActive(pet.getIsActive())
            .build();
    }
}
