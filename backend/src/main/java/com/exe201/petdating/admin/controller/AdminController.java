package com.exe201.petdating.admin.controller;

import com.exe201.petdating.admin.domain.PetStatus;
import com.exe201.petdating.admin.domain.UserStatus;
import com.exe201.petdating.admin.dto.AdminDashboardResponse;
import com.exe201.petdating.admin.dto.AdminPetResponse;
import com.exe201.petdating.admin.dto.AdminUserResponse;
import com.exe201.petdating.admin.dto.PaginatedResponse;
import com.exe201.petdating.admin.dto.UpdatePetModerationRequest;
import com.exe201.petdating.admin.dto.UpdateUserStatusRequest;
import com.exe201.petdating.admin.service.AdminService;
import com.exe201.petdating.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.ok("Admin dashboard fetched successfully", adminService.getDashboard());
    }

    @GetMapping("/users")
    public ApiResponse<PaginatedResponse<AdminUserResponse>> getUsers(
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        return ApiResponse.ok("Admin users fetched successfully", 
            adminService.getUsers(status, search, page, size, sortBy, sortDirection));
    }

    @GetMapping("/users/{userId}")
    public ApiResponse<AdminUserResponse> getUserById(@PathVariable String userId) {
        return ApiResponse.ok("Admin user fetched successfully", adminService.getUserById(userId));
    }

    @PatchMapping("/users/{userId}/status")
    public ApiResponse<AdminUserResponse> updateUserStatus(@PathVariable String userId,
                                                           @Valid @RequestBody UpdateUserStatusRequest request) {
        return ApiResponse.ok("Admin user status updated successfully", adminService.updateUserStatus(userId, request));
    }

    @GetMapping("/pets")
    public ApiResponse<PaginatedResponse<AdminPetResponse>> getPets(
            @RequestParam(required = false) PetStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean visible,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        return ApiResponse.ok("Admin pets fetched successfully", 
            adminService.getPets(status, search, visible, page, size, sortBy, sortDirection));
    }

    @GetMapping("/pets/{petId}")
    public ApiResponse<AdminPetResponse> getPetById(@PathVariable String petId) {
        return ApiResponse.ok("Admin pet fetched successfully", adminService.getPetById(petId));
    }

    @PatchMapping("/pets/{petId}/moderation")
    public ApiResponse<AdminPetResponse> updatePetModeration(@PathVariable String petId,
                                                             @Valid @RequestBody UpdatePetModerationRequest request) {
        return ApiResponse.ok("Admin pet moderation updated successfully", adminService.updatePetModeration(petId, request));
    }
}
