package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPet(@Valid @RequestBody CreatePetRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            PetResponse petResponse = petService.createPet(userId, request);
            return ResponseEntity.ok(petResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/{petId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPetById(@PathVariable String petId) {
        try {
            PetResponse petResponse = petService.getPetById(petId);
            return ResponseEntity.ok(petResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getPetsByUser() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            List<PetResponse> pets = petService.getPetsByUserId(userId);
            return ResponseEntity.ok(pets);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{petId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePet(@PathVariable String petId,
                                       @Valid @RequestBody CreatePetRequest request) {
        try {
            PetResponse petResponse = petService.updatePet(petId, request);
            return ResponseEntity.ok(petResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{petId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePet(@PathVariable String petId) {
        try {
            petService.deletePet(petId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Pet deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
