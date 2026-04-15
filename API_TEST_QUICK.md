# Quick Test Commands

Use these commands to quickly test all key flows. Update `<TOKEN>` with actual JWT tokens.

## Setup

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Seed database
cd e:\EXE122\EXE201_PETDATING_APP
node scripts/seed-data.js

# Terminal 3: Start backend
java -jar backend/target/petdating-admin-api-0.0.1-SNAPSHOT.jar

# Terminal 4: Start frontend
npm start
```

## Authentication

```bash
# Login
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"user1@example.com","password":"password123"}' \
  http://localhost:8080/api/v1/auth/login | jq -r '.data.token')

# Verify token works
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/users/me

# Login as admin (from seeded data, if admin role exists)
ADMIN_TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  http://localhost:8080/api/v1/auth/login | jq -r '.data.token')
```

## Admin Tests

```bash
# 1. Dashboard
echo "=== Admin Dashboard ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8080/api/v1/admin/dashboard | jq '.data'

# 2. List users
echo "=== Admin Users ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/users?status=ACTIVE&page=0&size=5" | jq '.data.content[0]'

# 3. Get specific user
USER_ID=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/users?page=0&size=1" | jq -r '.data.content[0].id')
echo "=== User Details (ID: $USER_ID) ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/users/$USER_ID" | jq '.data'

# 4. Update user status
echo "=== Updating user to SUSPENDED ==="
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"SUSPENDED"}' \
  "http://localhost:8080/api/v1/admin/users/$USER_ID/status" | jq '.data.status'

# Restore to ACTIVE
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"ACTIVE"}' \
  "http://localhost:8080/api/v1/admin/users/$USER_ID/status" > /dev/null

# 5. List pets
echo "=== Admin Pets ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets?visible=true&page=0&size=5" | jq '.data.content[0]'

# 6. Get specific pet
PET_ID=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets?page=0&size=1" | jq -r '.data.content[0].id')
echo "=== Pet Details (ID: $PET_ID) ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets/$PET_ID" | jq '.data'

# 7. Hide pet
echo "=== Hiding pet ==="
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVisible":false,"status":"ACTIVE"}' \
  "http://localhost:8080/api/v1/admin/pets/$PET_ID/moderation" | jq '.data.isVisible'

# Show pet again
curl -X PATCH -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isVisible":true,"status":"ACTIVE"}' \
  "http://localhost:8080/api/v1/admin/pets/$PET_ID/moderation" > /dev/null
```

## User Tests (with $TOKEN)

```bash
# 1. Get profile
echo "=== My Profile ==="
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/users/me | jq '.data'

# 2. Get my pets
echo "=== My Pets ==="
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/pets/my-pets | jq '.data[0]'

# 3. Get matches
echo "=== My Matches ==="
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/matches | jq '.data | length'

# 4. Get conversations
echo "=== My Conversations ==="
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/conversations | jq '.data | length'

# 5. Get messages in conversation
CONV_ID=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/conversations | jq -r '.data[0].id')
echo "=== Messages (Conversation: $CONV_ID) ==="
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/conversations/$CONV_ID/messages?page=0&size=10" | jq '.data.content | length'

# 6. Send message
echo "=== Sending message ==="
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"$CONV_ID\",\"content\":\"Hello from API test!\"}" \
  http://localhost:8080/api/v1/messages | jq '.data.content'

# 7. Get social feed
echo "=== Social Feed ==="
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/social/feed?page=0&size=10" | jq '.data.content | length'
```

## Search & Filter Tests

```bash
# Search users by name
echo "=== Search users by name ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/users?search=John&page=0&size=10" | jq '.data.totalElements'

# Filter pets by species
echo "=== Pets that are dogs ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets?search=dog&page=0&size=10" | jq '.data.totalElements'

# Pagination test
echo "=== Page 1 (10-20) of pets ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets?page=1&size=10" | jq '.data | {page, totalPages, totalElements}'
```

## Stress Test (Optional)

```bash
# Get performance baseline
echo "=== Performance Test (10 concurrent requests) ==="
for i in {1..10}; do
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    http://localhost:8080/api/v1/admin/dashboard | jq '.data.totalUsers' &
done
wait

# Check response time
echo "=== Response Time ==="
time curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
  "http://localhost:8080/api/v1/admin/pets?page=0&size=50" > /dev/null
```

## Error Cases

```bash
# 1. Invalid token
echo "=== Invalid Token ==="
curl -H "Authorization: Bearer INVALID_TOKEN" \
  http://localhost:8080/api/v1/admin/dashboard

# 2. Non-existent user
echo "=== Non-existent User ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8080/api/v1/admin/users/invalid_id

# 3. Non-existent pet
echo "=== Non-existent Pet ==="
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:8080/api/v1/admin/pets/invalid_id

# 4. Missing authorization
echo "=== No Auth Header ==="
curl http://localhost:8080/api/v1/admin/dashboard
```

## Helper: Extract All User IDs

```bash
# Get all user IDs (loop through pages)
echo "=== All User IDs ==="
for page in {0..4}; do
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    "http://localhost:8080/api/v1/admin/users?page=$page&size=20" | \
    jq -r '.data.content[].id'
done
```

## Helper: Extract All Pet IDs

```bash
# Get all pet IDs
echo "=== All Pet IDs ==="
for page in {0..7}; do
  curl -s -H "Authorization: Bearer $ADMIN_TOKEN" \
    "http://localhost:8080/api/v1/admin/pets?page=$page&size=20" | \
    jq -r '.data.content[].id'
done
```

## Useful aliases (add to ~/.bashrc or ~/.zshrc)

```bash
# Setup
alias test-setup='mongod & cd e:\EXE122\EXE201_PETDATING_APP && node scripts/seed-data.js & java -jar backend/target/petdating-admin-api-0.0.1-SNAPSHOT.jar & npm start'

# Get token
test-token() {
  curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"email\":\"$1\",\"password\":\"password123\"}" \
    http://localhost:8080/api/v1/auth/login | jq -r '.data.token'
}

# Make API call
api-get() {
  curl -s -H "Authorization: Bearer $TOKEN" \
    "http://localhost:8080$1" | jq
}

# Usage
# TOKEN=$(test-token user1@example.com)
# api-get /api/v1/users/me
```

## Notes

- Replace `<TOKEN>` with actual JWT from login
- Add `| jq` to format JSON output (install jq first)
- Add `-i` flag to curl to see response headers
- Use `-v` for verbose mode (try: `curl -v ...`)
- All test data expires after: seed script run (collections cleared)
- Default pagination: page=0, size=20
- Sort directions: ASC, DESC

## Troubleshooting Test Commands

```bash
# If jq is not installed
# Windows: choco install jq
# macOS: brew install jq
# Linux: sudo apt-get install jq

# Test if backend is running
curl -i http://localhost:8080/api/v1/admin/dashboard

# Check MongoDB
mongosh
use bosistive
db.users.countDocuments()

# View environment
echo $EXPO_PUBLIC_ADMIN_API_URL
```

---

**Last Updated:** April 15, 2026
