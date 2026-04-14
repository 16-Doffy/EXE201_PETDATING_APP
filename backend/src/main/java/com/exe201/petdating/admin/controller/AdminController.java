package com.exe201.petdating.admin.controller;

import com.exe201.petdating.admin.domain.PetStatus;
import com.exe201.petdating.admin.domain.UserStatus;
import com.exe201.petdating.admin.dto.AdminDashboardResponse;
import com.exe201.petdating.admin.dto.AdminPetResponse;
import com.exe201.petdating.admin.dto.AdminUserResponse;
import com.exe201.petdating.admin.dto.UpdatePetModerationRequest;
import com.exe201.petdating.admin.dto.UpdateUserStatusRequest;
import com.exe201.petdating.admin.service.AdminService;
import com.exe201.petdating.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.ok("Admin dashboard fetched successfully", adminService.getDashboard());
    }

    @GetMapping("/users")
    public ApiResponse<List<AdminUserResponse>> getUsers(@RequestParam(required = false) UserStatus status,
                                                         @RequestParam(required = false) String search) {
        return ApiResponse.ok("Admin users fetched successfully", adminService.getUsers(status, search));
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
    public ApiResponse<List<AdminPetResponse>> getPets(@RequestParam(required = false) PetStatus status,
                                                       @RequestParam(required = false) String search,
                                                       @RequestParam(required = false) Boolean visible) {
        return ApiResponse.ok("Admin pets fetched successfully", adminService.getPets(status, search, visible));
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
