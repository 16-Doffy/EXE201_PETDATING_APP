package com.exe201.petdating.main.dto;

import lombok.*;
import com.exe201.petdating.main.domain.FriendshipStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipResponse {
    private String id;
    private String user1Id;
    private String user2Id;
    private FriendshipStatus status;
    private String user1Name;
    private String user1Avatar;
    private String user2Name;
    private String user2Avatar;
}
