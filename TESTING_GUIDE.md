# Testing Guide: Admin & Application Flows

## 📋 Table of Contents

1. [Backend Setup](#backend-setup)
2. [Admin Testing](#admin-testing)
3. [Frontend Authentication Flow](#frontend-authentication-flow)
4. [User & Pet Management Flow](#user--pet-management-flow)
5. [Social Features Flow](#social-features-flow)
6. [Messaging & Conversations Flow](#messaging--conversations-flow)
7. [API Testing with cURL](#api-testing-with-curl)
8. [Troubleshooting](#troubleshooting)

---

## Backend Setup

### Prerequisites

```bash
# 1. Ensure MongoDB is running
mongod

# 2. Seed the database (if not already done)
cd e:\EXE122\EXE201_PETDATING_APP
node scripts/seed-data.js

# 3. Build backend
cd backend
mvn clean package -DskipTests -q

# 4. Start backend
java -jar target/petdating-admin-api-0.0.1-SNAPSHOT.jar
```

### Verify Backend is Running

```bash
# Check if backend is listening on port 8080
curl http://localhost:8080/api/v1/admin/dashboard
# Should return admin dashboard data
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin dashboard fetched successfully",
  "data": {
    "totalUsers": 100,
    "activeUsers": 95,
    "suspendedUsers": 3,
    "totalPets": 150,
    "visiblePets": 140,
    "totalMatches": 50,
    "totalConversations": 30,
    "totalMessages": 500
  }
}
```

---

## Admin Testing

### Admin Features Overview

The admin console provides moderation capabilities for:
- 👤 User management (view, search, suspend/ban)
- 🐾 Pet moderation (hide, archive, moderate content)
- 📊 Dashboard analytics
- 🔒 Admin authentication

### Admin Flows

#### Flow 1: Admin Dashboard Overview

**Location:** `app/admin/index.tsx`

**Steps:**
1. Start the backend: `java -jar target/petdating-admin-api-0.0.1-SNAPSHOT.jar`
2. Start the mobile app: `npm start` (from root directory)
3. Navigate to Admin Console
4. View dashboard with:
   - Total users count
   - Active/suspended user counts
   - Pet analytics (total, visible)
   - Matches, conversations, messages counts

**Expected Result:**
- ✅ Dashboard loads data from backend
- ✅ All statistics display correctly
- ✅ Backend URL shown: `http://localhost:8080`

**Test with:**
```bash
# Verify dashboard endpoint
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  http://localhost:8080/api/v1/admin/dashboard
```

---

#### Flow 2: Manage Users

**Location:** `app/admin/users.tsx`

**Features:**
- Search users by name/email
- Filter by status (ACTIVE, SUSPENDED, BANNED)
- Sort by date, status, name
- Pagination
- Update user status

**Test Steps:**

1. **Navigate to Users Management**
   - From Admin Console → "Manage Users"

2. **Search For User**
   - Enter search term (name or email)
   - Filter by status dropdown
   - Page through results

3. **View User Details**
   - Tap on any user
   - See profile info (name, email, phone, location)
   - View join date, last activity

4. **Update User Status**
   - Select a user
   - Tap "Suspend" or "Ban" button
   - Confirm action
   - Status should update immediately

**Test with cURL:**

```bash
# Get all users
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  "http://localhost:8080/api/v1/admin/users?status=ACTIVE&page=0&size=20&sortBy=createdAt&sortDirection=DESC"

# Get specific user
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  http://localhost:8080/api/v1/admin/users/[USER_ID]

# Update user status
curl -X PATCH -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "SUSPENDED"}' \
  http://localhost:8080/api/v1/admin/users/[USER_ID]/status
```

**Expected Responses:**

User List Response:
```json
{
  "success": true,
  "message": "Admin users fetched successfully",
  "data": {
    "content": [
      {
        "id": "65d1a234f5e6g7h8i9j0k1l2",
        "email": "user1@example.com",
        "name": "John Doe",
        "phone": "+1-555-0123",
        "status": "ACTIVE",
        "createdAt": "2025-12-15T10:30:00Z",
        "updatedAt": "2026-04-15T14:20:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

#### Flow 3: Moderate Pets

**Location:** `app/admin/pets.tsx`

**Features:**
- Search pets by name/breed/owner
- Filter by status (ACTIVE, ARCHIVED)
- Filter by visibility (visible/hidden)
- Pagination with sorting
- Hide or archive pets

**Test Steps:**

1. **Navigate to Pet Moderation**
   - From Admin Console → "Moderate Pets"

2. **Search and Filter**
   - Search: "Bulldog" (to find dog breeds)
   - Filter by status
   - Toggle visibility filter
   - Sort by creation date or popularity

3. **View Pet Details**
   - Tap on pet card
   - See pet info (name, breed, owner, age, traits)
   - View photos

4. **Moderate Pet**
   - Select pet
   - Toggle "Hide/Show" visibility
   - Set status to ARCHIVED or ACTIVE
   - Changes persist immediately

**Test with cURL:**

```bash
# Get all pets with filters
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  "http://localhost:8080/api/v1/admin/pets?status=ACTIVE&visible=true&search=Bulldog&page=0&size=20"

# Get specific pet
curl -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  http://localhost:8080/api/v1/admin/pets/[PET_ID]

# Update pet moderation
curl -X PATCH -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"isVisible": false, "status": "ARCHIVED"}' \
  http://localhost:8080/api/v1/admin/pets/[PET_ID]/moderation
```

**Expected Responses:**

Pet List Response:
```json
{
  "success": true,
  "message": "Admin pets fetched successfully",
  "data": {
    "content": [
      {
        "id": "65d1a234f5e6g7h8i9j0k2m3",
        "ownerId": "65d1a234f5e6g7h8i9j0k1l2",
        "ownerName": "John Doe",
        "name": "Bulldog 1",
        "species": "dog",
        "breed": "Labrador",
        "ageInMonths": 72,
        "gender": "male",
        "bio": "Friendly and playful",
        "isVisible": true,
        "status": "ACTIVE",
        "city": "New York",
        "district": "Manhattan",
        "createdAt": "2025-12-15T10:30:00Z",
        "updatedAt": "2026-04-15T14:20:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## Frontend Authentication Flow

### Overview

The authentication flow handles user/pet owner login and session management.

### Flow Steps

**Location:** `app/auth/login.tsx`, `context/AppContext.tsx`

**Test Scenario: User Login**

1. **Start Frontend**
   ```bash
   cd e:\EXE122\EXE201_PETDATING_APP
   npm start
   ```

2. **Navigate to Login**
   - App starts in onboarding section
   - Tap login/signin button
   - Should be redirected to login screen

3. **Enter Test Credentials**
   - Email: `user1@example.com`
   - Password: `password123` (matches seed data hash)

4. **Login Flow**
   - API calls `/api/login` endpoint
   - Receives JWT token
   - Token stored in AsyncStorage
   - Redirected to main app (tabs/explore)

5. **Session Management**
   - AppContext tracks current user
   - Pets list loaded
   - Matches displayed
   - Can logout via settings

**Test Flow in Code:**

```typescript
// From services/authService.ts
await loginUser({
  email: 'user1@example.com',
  password: 'password123'
});

// Returns JWT token
// Stored in AsyncStorage via appSession.ts
// User can now access protected endpoints
```

**Verification:**
- ✅ Login screen appears
- ✅ Credentials accepted
- ✅ Redirected to explore tab
- ✅ User pets visible
- ✅ Can logout and login again

---

## User & Pet Management Flow

### Overview

Users create pet profiles, view their own pets, and modify pet information.

### Key Screens

| Screen | Location | Purpose |
|--------|----------|---------|
| Profile | `app/(tabs)/profile.tsx` | View user info and owned pets |
| Pet Detail | `app/pet/[id].tsx` | View detailed pet information |
| Pet Form | Pet creation/edit form | Add or modify pet profiles |

### Test Flow: Create/Edit Pet Profile

**Flow:**

1. **Login as user**
   ```
   Email: user1@example.com
   Password: password123
   ```

2. **Navigate to Profile Tab**
   - See "My Pets" section
   - Tap "Add Pet" or existing pet

3. **Edit Pet Information**
   - Update name, breed, age
   - Add bio/description
   - Select interests/traits
   - Upload photos

4. **Save Changes**
   - Pet saved to database
   - Visible in matches/discover

**Test API Calls:**

```bash
# Get user's pets
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8080/api/v1/pets/my-pets

# Create new pet
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fluffy",
    "species": "CAT",
    "breed": "Persian",
    "ageInMonths": 24,
    "gender": "FEMALE",
    "bio": "Loves cuddles"
  }' \
  http://localhost:8080/api/v1/pets

# Update pet
curl -X PUT -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"bio": "Updated bio"}' \
  http://localhost:8080/api/v1/pets/[PET_ID]
```

---

## Social Features Flow

### Overview

Social interactions include:
- 👍 Liking pets
- ❤️ Viewing matches
- 💬 Messaging
- 📝 Posting updates
- 💭 Comments

### Key Components

| Feature | Screen | File |
|---------|--------|------|
| Discover | `app/(tabs)/explore.tsx` | Browse available pets |
| Matches | `app/(tabs)/matches.tsx` | Matched pets |
| Social Feed | `app/(tabs)/social.tsx` | Posts and interactions |
| Messages | `app/(tabs)/messages.tsx` | Conversations |

### Flow 1: Discover & Like Pets

**Test Steps:**

1. **Navigate to Explore Tab**
   - View pet cards
   - See pet photos, name, breed, location

2. **Like a Pet**
   - Tap ❤️ icon (like)
   - Tap 💔 icon (pass/dislike)
   - Tap ✨ icon (super like - rare match)

3. **Create Match**
   - If both pets like each other: automatic match
   - Match appears in "Matches" tab

**Test with API:**

```bash
# Like a pet
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"toPetId": "[PET_ID]", "type": "like"}' \
  http://localhost:8080/api/v1/likes

# Check matches
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8080/api/v1/matches
```

### Flow 2: View Matches

**Test Steps:**

1. **Go to Matches Tab**
   - See all mutual matches
   - View matched pet details

2. **Match Cards Show:**
   - Pet photo
   - Pet name & breed
   - Compatibility percentage (if available)
   - Location/distance

3. **Action Buttons:**
   - "Chat" → Opens conversation
   - "View Profile" → Pet details
   - "Unmatch" → Remove match

### Flow 3: Social Feed & Posts

**Test Steps:**

1. **Navigate to Social Tab**
   - View pet posts/updates
   - See comments and likes

2. **Create Post**
   - Tap "+" button
   - Add photo + caption
   - Share update

3. **Interact with Posts**
   - Like post: Tap ❤️
   - Comment: Tap comment icon
   - Share: Tap share button

**Test with API:**

```bash
# Get social feed
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8080/api/v1/social/feed

# Create post
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Just adopted this cutie!",
    "images": ["base64_image_data"],
    "petId": "[PET_ID]"
  }' \
  http://localhost:8080/api/v1/posts

# Comment on post
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "So cute!"}' \
  http://localhost:8080/api/v1/posts/[POST_ID]/comments
```

---

## Messaging & Conversations Flow

### Overview

Pets can message each other through conversations and real-time messaging.

### Key Features

- 💬 Create conversations
- 📧 Send/receive messages
- 🔔 Real-time updates
- 📱 Message history
- ✓ Read receipts

### Flow: Send Message

**Screens Involved:**
- `app/(tabs)/messages.tsx` - Inbox
- `app/chat/[id].tsx` - Conversation

**Test Steps:**

1. **Navigate to Messages Tab**
   - View all active conversations
   - See last message preview
   - Timestamp of last message

2. **Open Conversation**
   - Tap conversation
   - View message history
   - Messages sorted chronologically

3. **Send Message**
   - Type message in input field
   - Tap send button
   - Message appears in chat
   - Delivered status shown

4. **Receive Message (Test Both Directions)**
   - Open another device/session
   - Send message from other pet
   - Appears in real-time on first device

**Test with API:**

```bash
# Get conversations
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:8080/api/v1/conversations

# Get messages in conversation
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  "http://localhost:8080/api/v1/conversations/[CONVERSATION_ID]/messages?page=0&size=50"

# Send message
curl -X POST -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "[CONVERSATION_ID]",
    "content": "Hi! How are you?"
  }' \
  http://localhost:8080/api/v1/messages

# Mark message as read
curl -X PATCH -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"isRead": true}' \
  http://localhost:8080/api/v1/messages/[MESSAGE_ID]
```

**WebSocket Real-Time (Optional):**

```javascript
// Connect to WebSocket for real-time messages
const ws = new WebSocket('ws://localhost:8080/ws/chat/[USER_ID]');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('New message:', message);
};

// Send message via WebSocket
ws.send(JSON.stringify({
  type: 'message',
  conversationId: '[CONVERSATION_ID]',
  content: 'Real-time message'
}));
```

---

## API Testing with cURL

### Test Data

From seed script:
- **Users:** 100 (emails: user1@example.com to user100@example.com)
- **Pets:** 150 (mixed species)
- **Conversations:** 30
- **Messages:** 500+

### Authentication

```bash
# Login to get JWT token
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }' \
  http://localhost:8080/api/v1/auth/login

# Response includes JWT token
# Use in Authorization header: -H "Authorization: Bearer <TOKEN>"
```

### Common Test Commands

```bash
# 1. ADMIN: Get dashboard
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  http://localhost:8080/api/v1/admin/dashboard | jq

# 2. USER: Get my profile
curl -H "Authorization: Bearer <USER_TOKEN>" \
  http://localhost:8080/api/v1/users/me | jq

# 3. USER: Get my pets
curl -H "Authorization: Bearer <USER_TOKEN>" \
  http://localhost:8080/api/v1/pets/my-pets | jq

# 4. USER: Get matches
curl -H "Authorization: Bearer <USER_TOKEN>" \
  http://localhost:8080/api/v1/matches | jq

# 5. USER: Get conversations
curl -H "Authorization: Bearer <USER_TOKEN>" \
  http://localhost:8080/api/v1/conversations | jq

# Install jq for JSON formatting
# Windows: choco install jq
# or just omit | jq for plain JSON
```

### Pagination Parameters

```bash
# Standard pagination format
curl -H "Authorization: Bearer <TOKEN>" \
  "http://localhost:8080/api/v1/resource?page=0&size=20&sortBy=createdAt&sortDirection=DESC"

# Parameters:
# - page: 0-indexed (0 = first page)
# - size: items per page (default 20)
# - sortBy: field to sort on
# - sortDirection: ASC or DESC
```

---

## Troubleshooting

### Issue: Backend Not Responding

**Symptoms:** `Error: Cannot connect to admin backend`

**Solutions:**

1. **Check backend is running:**
   ```bash
   # Terminal 1: Navigate to backend
   cd e:\EXE122\EXE201_PETDATING_APP
   java -jar backend/target/petdating-admin-api-0.0.1-SNAPSHOT.jar
   
   # Terminal 2: Test connection
   curl http://localhost:8080/api/v1/admin/dashboard
   ```

2. **Check MongoDB:**
   ```bash
   # Verify MongoDB is running
   mongosh
   > use bosistive
   > db.users.countDocuments()
   ```

3. **Check API URL Configuration:**
   ```bash
   # .env file or environment variable
   EXPO_PUBLIC_ADMIN_API_URL=http://localhost:8080
   ```

### Issue: JWT Authentication Failed

**Symptoms:** `401 Unauthorized` or `Admin credentials rejected`

**Solutions:**

1. **Invalid Token:**
   - Re-login to get fresh token
   - Clear AsyncStorage: `await AsyncStorage.clear()`

2. **Token Expired:**
   - Logout and login again
   - Check token expiration in JWT

3. **Missing Authorization Header:**
   ```bash
   # WRONG ❌
   curl http://localhost:8080/api/v1/admin/dashboard
   
   # CORRECT ✅
   curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:8080/api/v1/admin/dashboard
   ```

### Issue: MongoDB Connection Error

**Symptoms:** `MongoClient connection timeout`

**Solutions:**

```bash
# 1. Start MongoDB
mongod

# 2. Verify mongosh connects
mongosh

# 3. Check database exists
> show databases
> use bosistive
> db.users.findOne()
```

### Issue: Seed Data Not Present

**Symptoms:** Admin dashboard shows 0 records

**Solutions:**

```bash
# Re-run seed script
node scripts/seed-data.js

# Verify seeding
node scripts/verify-seed.js
```

### Issue: Pets Not Appearing in Discover

**Symptoms:** Explore tab shows empty list

**Solutions:**

1. **Check seed data:**
   ```bash
   node scripts/verify-seed.js
   ```

2. **Verify pet visibility:**
   ```bash
   # Check if pets are visible=true
   curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:8080/api/v1/admin/pets?visible=true
   ```

3. **Check distance/location filters:**
   - Make sure current user location is set
   - Check pet location matches filter radius

### Issue: Cannot Send Messages

**Symptoms:** Message send fails or doesn't appear

**Solutions:**

1. **Verify conversation exists:**
   ```bash
   curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:8080/api/v1/conversations
   ```

2. **Check WebSocket connection (if using):**
   - Browser console → Network → WS tab
   - Should show connection to `/ws/chat/[USER_ID]`

3. **Verify both pets are matched:**
   - Open matches tab
   - Both pets should appear as matches
   - Only matched pets can message

---

## Quick Start Checklist

- [ ] MongoDB running: `mongod`
- [ ] Database seeded: `node scripts/seed-data.js`
- [ ] Backend started: `java -jar backend/target/*.jar`
- [ ] Backend responds: `curl http://localhost:8080/api/v1/admin/dashboard`
- [ ] Frontend started: `npm start`
- [ ] Admin login works
- [ ] Can view dashboard stats
- [ ] Can search and filter users
- [ ] Can moderate pets
- [ ] User login works
- [ ] Can view discover/explore tab
- [ ] Can like pets
- [ ] Can send messages

---

## Resources

- **Backend README:** `backend/README.md`
- **Seed Data Guide:** `SEED_DATA.md`
- **Admin Service:** `services/adminService.ts`
- **Admin Controller:** `backend/src/.../AdminController.java`
- **Type Definitions:** `types/admin.ts`

## Environment Variables

```env
# .env or .env.local
EXPO_PUBLIC_ADMIN_API_URL=http://localhost:8080

# For development
NODE_ENV=development
DEBUG=*

# For production
EXPO_PUBLIC_ADMIN_API_URL=https://petdating-admin-api.onrender.com
```

---

**Last Updated:** April 15, 2026  
**Version:** 1.0
