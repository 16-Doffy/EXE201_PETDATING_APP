# PetDating App - Testing Documentation Overview

## 📚 Testing Documents

This project includes comprehensive testing documentation to guide development and QA teams through all phases of testing.

### 1. **TESTING_GUIDE.md** - Complete Reference Guide
**Purpose:** Comprehensive guide for understanding and testing all application flows

**Sections:**
- Backend setup prerequisites
- Admin testing flows (dashboard, users, pets)
- Frontend authentication flow
- User & pet management flows
- Social features flow (discover, matches, posts)
- Messaging & conversations flow
- API testing with cURL examples
- Troubleshooting guide

**Best for:** Developers, QA engineers learning the system

**Quick Start:**
```bash
# Read the guide
cat TESTING_GUIDE.md
```

---

### 2. **API_TEST_QUICK.md** - Quick Reference Commands
**Purpose:** Copy-paste ready commands for rapid testing

**Sections:**
- Setup one-liners
- Authentication and token generation
- Admin API test commands
- User API test commands
- Search and filter examples
- Stress testing commands
- Helper aliases for streamlined workflow

**Best for:** Developers doing quick integration testing

**Quick Start:**
```bash
# Setup everything
# Terminal 1: MongoDB
mongod

# Terminal 2: Seed + Backend
cd e:\EXE122\EXE201_PETDATING_APP
node scripts/seed-data.js
java -jar backend/target/petdating-admin-api-0.0.1-SNAPSHOT.jar

# Terminal 3: Frontend
npm start

# Then copy commands from API_TEST_QUICK.md
```

---

### 3. **ADMIN_TEST_CHECKLIST.md** - QA Testing Checklist
**Purpose:** Detailed checkbox-based checklist for systematic QA testing

**Coverage (13 Phases):**
1. Pre-test setup
2. Backend connectivity
3. Admin dashboard UI
4. User management (list, search, filter, actions)
5. Pet moderation (visibility, archiving)
6. Advanced filtering
7. API response validation
8. Responsiveness (mobile/web)
9. Error handling & edge cases
10. Security & authorization
11. Performance & load
12. UX/UI & accessibility
13. Data consistency

**Features:**
- Checkbox progress tracking
- Expected outcomes defined
- Performance benchmarks
- Issue tracking template
- Test results summary
- Sign-off section

**Best for:** QA engineers conducting thorough testing sessions

**Quick Start:**
```bash
# Print and fill out checklist
cat ADMIN_TEST_CHECKLIST.md

# Or use in spreadsheet/TestRail
# Copy content to your QA tracking system
```

---

### 4. **SEED_DATA.md** - Seed Data Generation Guide
**Purpose:** How to generate test data for local development

**Covers:**
- Seed script setup
- Data generation (1,254 documents)
- Database verification
- Configuration options
- Troubleshooting

**Run seed data:**
```bash
node scripts/seed-data.js
node scripts/verify-seed.js
```

---

### 5. **backend/README.md** - Backend Setup & API
**Purpose:** Backend-specific setup and API documentation

**Contains:**
- Backend requirements
- Environment variables
- How to build & run
- Admin endpoints reference
- Example API requests

---

## 🎯 Quick Start by Role

### For Developers

1. **First Time Setup:**
   ```bash
   # Follow SEED_DATA.md
   node scripts/seed-data.js
   
   # Follow API_TEST_QUICK.md
   # Set up all three terminals
   ```

2. **Quick API Testing:**
   ```bash
   # Copy commands from API_TEST_QUICK.md
   TOKEN=$(curl -s ... ) # Get token
   curl -H "Authorization: Bearer $TOKEN" ... # Test endpoint
   ```

3. **Understanding Flows:**
   - Read TESTING_GUIDE.md sections
   - Focus on the flow you're working on
   - Use cURL examples to test

### For QA Engineers

1. **Systematic Testing:**
   - Open ADMIN_TEST_CHECKLIST.md
   - Work through each phase
   - Check off completed items
   - Document any issues

2. **Coverage:**
   - All phases in checklist
   - Both happy path and error cases
   - Performance benchmarks
   - Edge cases

3. **Sign-off:**
   - Complete all checklist items
   - Document issues found
   - Get approval before release

### For DevOps/Release

1. **Pre-Deployment Checklist:**
   - Backend deployment ready (JAR built)
   - Database migrations applied
   - Seed data loaded (if needed)
   - Environment variables configured

2. **Post-Deployment Verification:**
   - Backend health check
   - Admin console accessible
   - Sample data queries working
   - Performance baseline acceptable

---

## 📊 Testing Environment

### Tech Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Backend | Spring Boot | 3.3.5 |
| Java | JDK | 21 |
| Database | MongoDB | Latest |
| Frontend | React Native | 0.81.5 |
| Runtime | Expo | 54.0.33 |

### Database
- **Engine:** MongoDB
- **Location:** `mongodb://localhost:27017`
- **Database:** `bosistive`
- **Seed Data:** 1,254 documents across 8 collections

### Data Available from Seeding
| Collection | Count | Purpose |
|-----------|-------|---------|
| users | 100 | Test user accounts |
| pets | 150 | Test pet profiles |
| matches | 50 | Pre-made matches |
| likes | 199 | User interactions |
| conversations | 30 | Test chat history |
| messages | 500 | Test messages |
| posts | 75 | Social feed content |
| comments | 300 | Comment interactions |

---

## 🔑 Test Credentials

From seed data:

**Test Users:**
```
Email: user1@example.com to user100@example.com
Password: password123 (for all)
```

**Admin Account:**
- Must be created manually or designated by admin role
- Same password format as regular users

---

## 🚀 Complete Testing Workflow

### Phase 1: Prepare Environment
```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Setup backend
cd e:\EXE122\EXE201_PETDATING_APP
node scripts/seed-data.js  # ~5 seconds
node scripts/verify-seed.js  # Check data

# Build backend
mvn clean package -DskipTests

# Start backend
java -jar target/petdating-admin-api-0.0.1-SNAPSHOT.jar

# Terminal 3: Frontend
npm start
```

**Verification Steps:**
```bash
# Backend check
curl http://localhost:8080/api/v1/admin/dashboard

# Should return dashboard data (not empty)
```

### Phase 2: Unit/Integration Testing
- Run test suite (if available)
- Test individual endpoints
- Use API_TEST_QUICK.md commands

### Phase 3: Functional Testing
- Follow TESTING_GUIDE.md flows
- Test each screen/feature
- Verify data persistence

### Phase 4: QA Testing
- Use ADMIN_TEST_CHECKLIST.md
- Systematically check all items
- Document issues
- Track performance metrics

### Phase 5: Release Testing
- Final verification of all flows
- Performance acceptable
- No critical issues
- Get sign-off

---

## 📈 Key Testing Scenarios

### Admin Console
1. ✅ View dashboard stats
2. ✅ Search and filter users
3. ✅ Update user status (suspend/ban)
4. ✅ Search and filter pets
5. ✅ Hide/archive pets
6. ✅ Pagination works
7. ✅ Sorting options work
8. ✅ Real-time updates

### User App
1. ✅ Login with test account
2. ✅ View profile
3. ✅ Browse pet discover
4. ✅ Like/dislike pets
5. ✅ View matches
6. ✅ Send messages
7. ✅ View social feed
8. ✅ Logout

### Backend API
1. ✅ Authentication
2. ✅ Authorization (admin vs user)
3. ✅ CRUD operations
4. ✅ Pagination
5. ✅ Filtering
6. ✅ Searching
7. ✅ Error handling
8. ✅ Response formats

---

## 🐛 Debugging Tips

### Backend Issues
```bash
# Check logs
tail -f nohup.out

# Check database connection
mongosh
use bosistive
db.users.countDocuments()

# Verify JWT token
# Check payload using jwt.io
```

### Frontend Issues
```bash
# Clear cache
npm start -- --clear

# Check environment variables
echo $EXPO_PUBLIC_ADMIN_API_URL

# View device logs (if on physical device)
expo logs
```

### Common Issues
See **TESTING_GUIDE.md → Troubleshooting** section

---

## 📋 Testing Metrics

### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard Load | < 1s | Time to display |
| User List Load | < 2s | Page of 20 users |
| Pet Search | < 1s | Query + display |
| Status Update | < 1s | Save to response |
| API Response | < 500ms | Avg response time |

### Coverage Goals
| Area | Target |
|------|--------|
| Admin Features | 100% |
| User API | 100% |
| Error Cases | 90%+ |
| Edge Cases | 80%+ |

---

## 📝 Documentation Standards

### When Writing Tests
1. **Preconditions:** What must be true before test starts
2. **Steps:** Clear numbered steps
3. **Expected Result:** What should happen
4. **Actual Result:** What actually happened (fill in during testing)
5. **Status:** PASS/FAIL/BLOCKED

### Example Test Case
```
Title: User can suspend another user

Preconditions:
- Admin logged in
- Admin on Users page
- Test user ID: 123 with status ACTIVE

Steps:
1. Find user ID 123 in list
2. Click on user
3. Click "Suspend" button
4. Select reason from dropdown
5. Click "Confirm"

Expected Result:
- Dialog closes within 1 second
- User status changes to SUSPENDED
- Card updates immediately
- List still shows user (but with SUSPENDED badge)

Actual Result:
✅ PASS - All steps completed as expected
```

---

## 🔗 Related Files

- `backend/README.md` - Backend setup details
- `SEED_DATA.md` - Data generation guide
- `services/adminService.ts` - Admin API client
- `services/api.ts` - API request handler
- `app/admin/` - Admin UI screens
- `backend/src/main/java/.../admin/` - Admin backend

---

## 📞 Support & Questions

### Common Questions

**Q: How do I generate fresh test data?**
A: Run `node scripts/seed-data.js` - it clears old data and creates new data

**Q: Can I test with my own data?**
A: Yes, modify `scripts/seed-data.js` to adjust quantities and content

**Q: How do I test error cases?**
A: Use ADMIN_TEST_CHECKLIST.md Phase 9, or use invalid IDs in API calls

**Q: Can I run tests in parallel?**
A: Yes, use different terminals for MongoDB, Backend, and Frontend

**Q: How do performance benchmarks?**
A: Use `curl -w` flags or browser DevTools Network tab

---

## ✅ Pre-Release Checklist

Before going to production:

- [ ] All ADMIN_TEST_CHECKLIST.md items passed
- [ ] No critical issues reported
- [ ] Performance meets targets
- [ ] Security review completed
- [ ] All environments tested (dev, staging, prod)
- [ ] Rollback plan prepared
- [ ] Monitoring configured
- [ ] Stakeholder sign-off

---

**Version:** 1.0  
**Last Updated:** April 15, 2026  
**Maintained By:** Development Team

For updates or questions, refer to individual documentation files above.
