package com.exe201.petdating.admin.service;

import com.exe201.petdating.admin.document.PetDocument;
import com.exe201.petdating.admin.document.UserDocument;
import com.exe201.petdating.admin.domain.PetStatus;
import com.exe201.petdating.admin.domain.UserStatus;
import com.exe201.petdating.admin.dto.AdminDashboardResponse;
import com.exe201.petdating.admin.dto.AdminPetResponse;
import com.exe201.petdating.admin.dto.AdminUserResponse;
import com.exe201.petdating.admin.dto.PaginatedResponse;
import com.exe201.petdating.admin.dto.UpdatePetModerationRequest;
import com.exe201.petdating.admin.dto.UpdateUserStatusRequest;
import com.exe201.petdating.admin.repository.ConversationRepository;
import com.exe201.petdating.admin.repository.MatchRepository;
import com.exe201.petdating.admin.repository.MessageRepository;
import com.exe201.petdating.admin.repository.PetRepository;
import com.exe201.petdating.admin.repository.UserRepository;
import com.exe201.petdating.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminService {

    @Qualifier("adminUserRepository")
    private final UserRepository userRepository;
    @Qualifier("adminPetRepository")
    private final PetRepository petRepository;
    @Qualifier("adminMatchRepository")
    private final MatchRepository matchRepository;
    @Qualifier("adminConversationRepository")
    private final ConversationRepository conversationRepository;
    @Qualifier("adminMessageRepository")
    private final MessageRepository messageRepository;
    private final MongoTemplate mongoTemplate;

    public AdminDashboardResponse getDashboard() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);
        long suspendedUsers = userRepository.countByStatus(UserStatus.SUSPENDED);
        long totalPets = petRepository.count();
        long visiblePets = petRepository.countByIsVisibleTrue();
        long totalMatches = matchRepository.count();
        long totalConversations = conversationRepository.count();
        long totalMessages = messageRepository.count();

        return new AdminDashboardResponse(
                totalUsers,
                activeUsers,
                suspendedUsers,
                totalPets,
                visiblePets,
                totalMatches,
                totalConversations,
                totalMessages
        );
    }

    public PaginatedResponse<AdminUserResponse> getUsers(UserStatus status, String search, int page, int size, String sortBy, String sortDirection) {
        Query query = new Query();
        
        // Apply filters
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        if (hasText(search)) {
            String regex = Pattern.quote(search.trim());
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("email").regex(regex, "i"),
                    Criteria.where("phone").regex(regex, "i"),
                    Criteria.where("city").regex(regex, "i"),
                    Criteria.where("district").regex(regex, "i")
            ));
        }

        // Get total count
        long totalElements = mongoTemplate.count(query, UserDocument.class);

        // Apply sorting
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        query.with(Sort.by(direction, sortBy));

        // Apply pagination
        query.skip((long) page * size).limit(size);

        List<AdminUserResponse> content = mongoTemplate.find(query, UserDocument.class)
                .stream()
                .map(this::toAdminUserResponse)
                .toList();

        return PaginatedResponse.of(content, page, size, totalElements);
    }

    public AdminUserResponse getUserById(String userId) {
        UserDocument user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return toAdminUserResponse(user);
    }

    public AdminUserResponse updateUserStatus(String userId, UpdateUserStatusRequest request) {
        UserDocument user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setStatus(request.status());
        user.setUpdatedAt(Instant.now());
        return toAdminUserResponse(userRepository.save(user));
    }

    public PaginatedResponse<AdminPetResponse> getPets(PetStatus status, String search, Boolean visible, int page, int size, String sortBy, String sortDirection) {
        Query query = new Query();

        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        if (visible != null) {
            query.addCriteria(Criteria.where("isVisible").is(visible));
        }

        if (hasText(search)) {
            String regex = Pattern.quote(search.trim());
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(regex, "i"),
                    Criteria.where("breed").regex(regex, "i"),
                    Criteria.where("city").regex(regex, "i"),
                    Criteria.where("district").regex(regex, "i"),
                    Criteria.where("ownerSnapshot.name").regex(regex, "i")
            ));
        }

        // Get total count
        long totalElements = mongoTemplate.count(query, PetDocument.class);

        // Apply sorting
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;
        query.with(Sort.by(direction, sortBy));

        // Apply pagination
        query.skip((long) page * size).limit(size);

        List<AdminPetResponse> content = mongoTemplate.find(query, PetDocument.class)
                .stream()
                .map(this::toAdminPetResponse)
                .toList();

        return PaginatedResponse.of(content, page, size, totalElements);
    }

    public AdminPetResponse getPetById(String petId) {
        PetDocument pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + petId));
        return toAdminPetResponse(pet);
    }

    public AdminPetResponse updatePetModeration(String petId, UpdatePetModerationRequest request) {
        PetDocument pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found: " + petId));
        pet.setIsVisible(request.isVisible());
        pet.setStatus(request.status());
        pet.setUpdatedAt(Instant.now());
        return toAdminPetResponse(petRepository.save(pet));
    }

    private AdminUserResponse toAdminUserResponse(UserDocument user) {
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getAvatarUrl(),
                user.getPhone(),
                user.getRoles(),
                user.getStatus(),
                user.getHasCompletedOnboarding(),
                user.getLastActiveAt(),
                user.getCity(),
                user.getDistrict(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    private AdminPetResponse toAdminPetResponse(PetDocument pet) {
        return new AdminPetResponse(
                pet.getId(),
                pet.getOwnerId(),
                pet.getOwnerSnapshot() != null ? pet.getOwnerSnapshot().getName() : null,
                pet.getName(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getAgeInMonths(),
                pet.getGender(),
                pet.getBio(),
                pet.getTraits(),
                pet.getIsOnline(),
                pet.getIsVisible(),
                pet.getStatus(),
                pet.getCity(),
                pet.getDistrict(),
                pet.getCreatedAt(),
                pet.getUpdatedAt()
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
