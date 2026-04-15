package com.exe201.petdating.main.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.exe201.petdating.main.domain.SubscriptionPlan;
import java.time.Instant;

@Document(collection = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDocument {
    @Id
    private String id;
    private String userId;
    private SubscriptionPlan plan;
    private Instant startDate;
    private Instant endDate;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
