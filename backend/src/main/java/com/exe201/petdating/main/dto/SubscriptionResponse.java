package com.exe201.petdating.main.dto;

import lombok.*;
import com.exe201.petdating.main.domain.SubscriptionPlan;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponse {
    private String id;
    private String userId;
    private SubscriptionPlan plan;
    private String startDate;
    private String endDate;
    private Boolean isActive;
}
