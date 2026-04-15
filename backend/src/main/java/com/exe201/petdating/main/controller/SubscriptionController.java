package com.exe201.petdating.main.controller;

import com.exe201.petdating.main.dto.*;
import com.exe201.petdating.main.domain.SubscriptionPlan;
import com.exe201.petdating.main.service.SubscriptionService;
import com.exe201.petdating.main.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createSubscription(@Valid @RequestBody UpgradeSubscriptionRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            SubscriptionPlan plan = SubscriptionPlan.valueOf(request.getPlanName().toUpperCase());
            SubscriptionResponse subscriptionResponse = subscriptionService.createSubscription(userId, plan);
            return ResponseEntity.ok(subscriptionResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getActiveSubscription() {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return subscriptionService.getActiveSubscription(userId)
                .map(resp -> ResponseEntity.ok((Object) resp))
                .orElseGet(() -> ResponseEntity.ok(new ApiResponse<>(false, "No active subscription", null)));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/upgrade")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> upgradeSubscription(@Valid @RequestBody UpgradeSubscriptionRequest request) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            SubscriptionPlan plan = SubscriptionPlan.valueOf(request.getPlanName().toUpperCase());
            SubscriptionResponse subscriptionResponse = subscriptionService.upgradeSubscription(userId, plan);
            return ResponseEntity.ok(subscriptionResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/has-feature/{feature}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> hasFeature(@PathVariable String feature) {
        try {
            String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            boolean hasFeature = subscriptionService.hasFeature(userId, feature);
            return ResponseEntity.ok(new ApiResponse<>(true, "Feature check completed", hasFeature));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
