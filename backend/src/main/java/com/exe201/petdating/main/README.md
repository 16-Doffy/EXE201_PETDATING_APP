# Pet Dating App - Main Backend API

## Project Overview

This is the main backend for the Pet Dating application, built with Spring Boot and MongoDB. It handles the core user-facing features including authentication, pet profiles, social feed, messaging, and premium subscriptions.

## Architecture

### Folder Structure

```
src/main/java/com/exe201/petdating/main/
├── config/          # Spring configurations
├── controller/      # REST API endpoints
├── document/        # MongoDB document classes
├── domain/          # Enum definitions
├── dto/            # Data Transfer Objects
├── exception/       # Global exception handling
├── repository/      # MongoDB data access layer
└── service/        # Business logic layer
```

## Components

### Domain Layer (`domain/`)
- **UserRole.java**: USER, ADMIN
- **FriendshipStatus.java**: PENDING, ACCEPTED, REJECTED, BLOCKED
- **SubscriptionPlan.java**: FREE, WEEKLY, MONTHLY
- **PetSpecies.java**: DOG, CAT, BIRD, RABBIT, HAMSTER, GUINEA_PIG, OTHER
- **HealthStatus.java**: HEALTHY, VACCINATED, PARTIALLY_VACCINATED, NEEDS_CHECKUP, UNDER_TREATMENT

### Document Layer (`document/`)
MongoDB document classes representing data models:
- **UserDocument**: User profiles with authentication info
- **PetDocument**: Pet information
- **PostDocument**: Social feed posts
- **LikeDocument**: Post likes
- **CommentDocument**: Post comments
- **FriendshipDocument**: User connections/matches
- **MessageDocument**: Direct messaging
- **SubscriptionDocument**: Premium subscription tracking

### Repository Layer (`repository/`)
MongoDB repository interfaces for CRUD operations and custom queries:
- **UserRepository**: Find by email, phone, check existence
- **PetRepository**: Query by userId, species, isActive
- **PostRepository**: Query by userId, petId, ordered by date
- **LikeRepository**: Check likes, count, manage likes
- **CommentRepository**: Query comments by post/user, count
- **FriendshipRepository**: Complex queries for user connections
- **MessageRepository**: Query conversations, track read status
- **SubscriptionRepository**: Check active subscriptions

### Service Layer (`service/`)
Business logic implementation:
- **AuthService**: User signup, login, JWT token generation
- **JwtTokenProvider**: JWT token creation and validation
- **UserService**: User profile management
- **PetService**: Pet CRUD operations
- **PostService**: Feed management, post operations
- **LikeService**: Post like/unlike functionality
- **CommentService**: Comment management
- **MessageService**: Direct messaging
- **FriendshipService**: Match requests, connections
- **SubscriptionService**: Premium tier management

### Controller Layer (`controller/`)
REST API endpoints:
- **AuthController** (`/api/auth`)
  - POST /signup
  - POST /login
  - GET /me

- **UserController** (`/api/users`)
  - GET /{userId}
  - GET /profile/me
  - PUT /update_profile

- **PetController** (`/api/pets`)
  - POST /create
  - GET /{petId}
  - GET /list
  - PUT /{petId}
  - DELETE /{petId}

- **PostController** (`/api/posts`)
  - POST /create
  - GET /feed
  - GET /{postId}
  - PUT /{postId}
  - DELETE /{postId}

- **LikeController** (`/api/posts/{postId}/likes`)
  - POST /like
  - DELETE /unlike

- **CommentController** (`/api/posts/{postId}/comments`)
  - POST /add
  - GET /list
  - DELETE /{commentId}

- **MessageController** (`/api/messages`)
  - POST /{receiverId}
  - GET /{userId}
  - GET /list
  - GET /unread/count
  - PUT /{messageId}/read

- **FriendshipController** (`/api/friendships`)
  - POST /send_request
  - PUT /{requestId}/accept
  - PUT /{requestId}/reject
  - GET /matches
  - GET /pending

- **SubscriptionController** (`/api/subscriptions`)
  - POST /create
  - GET /status
  - PUT /upgrade
  - GET /has-feature/{feature}

### DTO Layer (`dto/`)
Request/Response objects for API communication:
- **SignupRequest, LoginRequest**: Authentication
- **UserResponse, AuthResponse**: User data
- **CreatePetRequest, PetResponse**: Pet management
- **CreatePostRequest, PostResponse**: Post management
- **CommentRequest, CommentResponse**: Comments
- **MessageRequest, MessageResponse**: Messaging
- **FriendshipRequest, FriendshipResponse**: Connections
- **SubscriptionResponse, UpgradeSubscriptionRequest**: Subscriptions
- **ApiResponse<T>**: Generic response wrapper

## Configuration

### application-main.yml
- MongoDB connection URI
- JWT secret and expiration
- Logging configuration
- Server port (8080)

## Setup Instructions

1. **Dependencies**: All necessary dependencies are configured in `pom.xml`
   - Spring Boot 3.3.5
   - Spring Data MongoDB
   - Spring Security
   - JWT (jjwt 0.12.3)
   - Lombok

2. **MongoDB Setup**:
   ```bash
   # Local MongoDB
   mongo --uri "mongodb://localhost:27017/petdating_main"
   
   # Or MongoDB Atlas (update application-main.yml with connection string)
   ```

3. **Environment Variables**:
   ```
   JWT_SECRET=your-secret-key-here
   ```

4. **Build & Run**:
   ```bash
   mvn clean install
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=main"
   ```

## API Authentication

All protected endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Database Schema

MongoDB collections structure:
- **users**: User profiles and authentication
- **pets**: Pet information
- **posts**: Social feed
- **likes**: Post engagement
- **comments**: Post comments
- **friendships**: User connections
- **messages**: Direct messaging
- **subscriptions**: Premium tiers

## Next Steps

1. Implement global JWT filter for authentication
2. Add input validation annotations
3. Implement pagination for list endpoints
4. Add caching layer (Redis)
5. Configure CORS for frontend integration
6. Add API documentation (Swagger/OpenAPI)
7. Implement file upload service (profile images, pet photos)
8. Add admin dashboard functionality
