package com.exe201.petdating.main.service;

import com.exe201.petdating.main.document.SubscriptionDocument;
import com.exe201.petdating.main.domain.SubscriptionPlan;
import com.exe201.petdating.main.dto.SubscriptionResponse;
import com.exe201.petdating.main.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    
    public SubscriptionResponse createSubscription(String userId, SubscriptionPlan plan) {
        Optional<SubscriptionDocument> existing = subscriptionRepository.findByUserId(userId);
        if (existing.isPresent()) {
            throw new RuntimeException("User already has a subscription");
        }
        
        Instant now = Instant.now();
        Instant endDate = plan == SubscriptionPlan.WEEKLY 
            ? now.plus(7, ChronoUnit.DAYS)
            : now.plus(30, ChronoUnit.DAYS);
        
        SubscriptionDocument subscription = SubscriptionDocument.builder()
            .userId(userId)
            .plan(plan)
            .startDate(now)
            .endDate(endDate)
            .isActive(true)
            .createdAt(now)
            .updatedAt(now)
            .build();
        
        SubscriptionDocument savedSubscription = subscriptionRepository.save(subscription);
        return convertToResponse(savedSubscription);
    }
    
    public SubscriptionResponse upgradeSubscription(String userId, SubscriptionPlan newPlan) {
        SubscriptionDocument subscription = subscriptionRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        Instant now = Instant.now();
        Instant newEndDate = newPlan == SubscriptionPlan.WEEKLY
            ? now.plus(7, ChronoUnit.DAYS)
            : now.plus(30, ChronoUnit.DAYS);
        
        subscription.setPlan(newPlan);
        subscription.setEndDate(newEndDate);
        subscription.setUpdatedAt(now);
        
        SubscriptionDocument updatedSubscription = subscriptionRepository.save(subscription);
        return convertToResponse(updatedSubscription);
    }
    
    public Optional<SubscriptionResponse> getActiveSubscription(String userId) {
        return subscriptionRepository.findActiveByUserId(userId)
            .map(this::convertToResponse);
    }
    
    public boolean hasActiveSubscription(String userId) {
        return subscriptionRepository.findActiveByUserId(userId).isPresent();
    }
    
    public boolean hasFeature(String userId, String feature) {
        Optional<SubscriptionDocument> subscription = subscriptionRepository.findActiveByUserId(userId);
        if (subscription.isEmpty()) {
            return false;
        }
        
        SubscriptionDocument sub = subscription.get();
        switch (feature) {
            case "premium_chat":
                return sub.getPlan() != SubscriptionPlan.FREE;
            case "advanced_filters":
                return sub.getPlan() == SubscriptionPlan.MONTHLY;
            case "unlimited_likes":
                return sub.getPlan() != SubscriptionPlan.FREE;
            default:
                return false;
        }
    }
    
    private SubscriptionResponse convertToResponse(SubscriptionDocument subscription) {
        return SubscriptionResponse.builder()
            .id(subscription.getId())
            .userId(subscription.getUserId())
            .plan(subscription.getPlan())
            .startDate(subscription.getStartDate().toString())
            .endDate(subscription.getEndDate().toString())
            .isActive(subscription.getIsActive())
            .build();
    }
}
