# Admin Testing Checklist

Use this checklist to systematically test all admin features before deployment.

## Pre-Test Setup

- [ ] MongoDB running (`mongod`)
- [ ] Database seeded (`node scripts/seed-data.js`)
- [ ] Backend running (`java -jar target/petdating-admin-api-0.0.1-SNAPSHOT.jar`)
- [ ] Frontend running (`npm start`)
- [ ] Admin account created/available
- [ ] Test user accounts available (from seed data)
- [ ] Network connectivity verified

## Phase 1: Backend Connectivity

### Dashboard Endpoint
- [ ] Backend responds to `/api/v1/admin/dashboard`
- [ ] Response includes all statistics
  - [ ] `totalUsers` > 0
  - [ ] `totalPets` > 0
  - [ ] `totalMatches` > 0
  - [ ] `totalConversations` > 0
- [ ] Response time < 500ms

### Authentication
- [ ] Admin can login with valid credentials
- [ ] JWT token received
- [ ] Token stored in browser/app storage
- [ ] Logout clears token
- [ ] Re-login works correctly

## Phase 2: Admin Dashboard UI

### Dashboard Screen (`/admin/index.tsx`)

#### Layout & Display
- [ ] Title displays: "Admin Console"
- [ ] Backend URL shown correctly
- [ ] Four stat cards visible:
  - [ ] Users (total/active/suspended)
  - [ ] Pets (total/visible)
  - [ ] Matches
  - [ ] Messages/Conversations

#### Stats Accuracy
- [ ] User stats = total matches active+suspended+banned
- [ ] Pet stats = total matches visible+hidden
- [ ] Stats auto-refresh on screen load
- [ ] Pull-to-refresh updates stats

#### Navigation Buttons
- [ ] "Manage Users" button navigates to users list
- [ ] "Moderate Pets" button navigates to pets list
- [ ] Back button returns to previous screen

#### Error Handling
- [ ] Backend offline → shows error message
- [ ] Invalid credentials → redirects to login
- [ ] Timeout → shows retry button
- [ ] Empty state handled gracefully

## Phase 3: User Management

### Users List Screen (`/admin/users.tsx`)

#### Display & Loading
- [ ] List loads with users
- [ ] Each user card shows:
  - [ ] Name/username
  - [ ] Email
  - [ ] Status (ACTIVE/SUSPENDED/BANNED)
  - [ ] Join date
  - [ ] Last active timestamp
  - [ ] Location (city, district)

#### Pagination
- [ ] Shows page indicator (e.g., "Page 1 of 5")
- [ ] Next button works when more pages exist
- [ ] Previous button disabled on first page
- [ ] Can jump to specific page
- [ ] Page size selector works (10, 20, 50 items)

#### Sorting
- [ ] Can sort by:
  - [ ] Creation date (ASC/DESC)
  - [ ] Last active (ASC/DESC)
  - [ ] Name/username (A-Z)
  - [ ] Status
- [ ] Sort indicator shows current order (↑/↓)

#### Search & Filter
- [ ] Search by name (case-insensitive)
- [ ] Search by email
- [ ] Filter by status:
  - [ ] ACTIVE only
  - [ ] SUSPENDED only
  - [ ] BANNED only
  - [ ] All statuses
- [ ] Search + filter work together
- [ ] Clear filters button works

### User Detail View

#### User Information
- [ ] Avatar displays (or placeholder)
- [ ] Name (editable or display only)
- [ ] Email (display only)
- [ ] Phone number
- [ ] Location (city, district)
- [ ] Account creation date
- [ ] Last active date/time
- [ ] Current status badge

#### User Status Management
- [ ] Current status clearly indicated
- [ ] Status change buttons available:
  - [ ] "ACTIVATE" button (if suspended/banned)
  - [ ] "SUSPEND" button (if active)
  - [ ] "BAN" button (if active or suspended)
- [ ] Status change requires confirmation
- [ ] Confirmation shows new status
- [ ] After confirmation, status updates:
  - [ ] Within 1-2 seconds
  - [ ] In user list
  - [ ] In user detail view

#### User Statistics
- [ ] Number of pets owned
- [ ] Number of matches
- [ ] Number of messages
- [ ] Last login date

#### User Actions
- [ ] Can view user's pets
- [ ] Can view user's matches
- [ ] Can view user's messages
- [ ] Can send admin message (optional)

### Status Change Tests

#### ACTIVE → SUSPENDED
- [ ] Click "Suspend" button
- [ ] Confirmation modal appears
- [ ] Select reason (dropdown)
- [ ] Confirm action
- [ ] Status updates to SUSPENDED
- [ ] User badge changes color
- [ ] User can't log in (test on frontend)

#### SUSPENDED → ACTIVE
- [ ] Click "Activate" button
- [ ] Status reverts to ACTIVE
- [ ] User can log in again

#### ACTIVE → BANNED
- [ ] Click "Ban" button
- [ ] Confirmation required
- [ ] Ban reason logged
- [ ] Status changes to BANNED
- [ ] User cannot access account
- [ ] Cannot be reactivated (or admin must manually unban)

## Phase 4: Pet Moderation

### Pets List Screen (`/admin/pets.tsx`)

#### Display & Loading
- [ ] List loads with pets
- [ ] Each pet card shows:
  - [ ] Pet photo/thumbnail
  - [ ] Pet name
  - [ ] Breed & species
  - [ ] Owner name
  - [ ] Age in months (converted to years if needed)
  - [ ] Location
  - [ ] Visibility status (visible/hidden)
  - [ ] Moderation status (ACTIVE/ARCHIVED)

#### Pagination
- [ ] Shows page indicator
- [ ] Next/Previous buttons work correctly
- [ ] Can change page size
- [ ] Total items displayed

#### Sorting
- [ ] Can sort by:
  - [ ] Creation date
  - [ ] Pet name
  - [ ] Breed
  - [ ] Owner name
  - [ ] Upload date

#### Search & Filter
- [ ] Search by pet name
- [ ] Search by breed
- [ ] Search by owner name
- [ ] Search by location
- [ ] Filter by visibility:
  - [ ] Visible only
  - [ ] Hidden only
  - [ ] All
- [ ] Filter by status:
  - [ ] ACTIVE only
  - [ ] ARCHIVED only
  - [ ] All
- [ ] Combined search + filter works

### Pet Detail View

#### Pet Information
- [ ] Pet photos gallery (if multiple)
- [ ] Pet name
- [ ] Species (dog, cat, bird, etc.)
- [ ] Breed
- [ ] Age in months/years
- [ ] Gender
- [ ] Bio/description
- [ ] Traits/interests list
- [ ] Owner information:
  - [ ] Owner name (clickable to owner profile)
  - [ ] Owner contact info
- [ ] Location (city, district)
- [ ] Creation date
- [ ] Last modified date

#### Pet Moderation Controls
- [ ] Visibility toggle (Visible ↔ Hidden)
  - [ ] Visual indicator of current state
  - [ ] Toggle updates immediately
  - [ ] Reflects in list view
- [ ] Status dropdown:
  - [ ] ACTIVE → ARCHIVED
  - [ ] ARCHIVED → ACTIVE
- [ ] Hide reason (if hiding):
  - [ ] Dropdown of predefined reasons
  - [ ] Custom reason input
  - [ ] Reason logged in history

#### Pet Visibility Tests

##### Hide Pet
- [ ] Toggle visibility to Hidden
- [ ] Status updates in list
- [ ] Pet no longer appears in user discover
- [ ] Can be toggled back to Visible

##### Archive Pet
- [ ] Set status to ARCHIVED
- [ ] Pet removed from active listings
- [ ] Cannot be discovered
- [ ] Can be reactivated by admin
- [ ] Owner can still see archived pet

##### View Pet History
- [ ] Can see moderation history (if available)
- [ ] Previous status changes logged
- [ ] Reason for hiding shown
- [ ] Admin who made change recorded

#### Photo Moderation (if available)
- [ ] Can flag inappropriate photos
- [ ] Can hide specific photos
- [ ] Can remove photos
- [ ] Can add admin notes

## Phase 5: Advanced Filtering & Search

### Complex Queries

- [ ] Search name + filter status: returns correct results
- [ ] Search email + filter visible pet only: correct
- [ ] Search breed + filter location + sort by date: correct
- [ ] Empty search returns all results
- [ ] Special characters in search handled
- [ ] Case-insensitive search works
- [ ] Partial matches work (e.g., "Bulld" finds "Bulldog")

### Performance

- [ ] Large result sets (500+ items) load quickly
- [ ] Pagination works smoothly with large results
- [ ] Search completes within 2 seconds
- [ ] No UI freezing during filter operations

## Phase 6: API Response Validation

### Response Format

All API responses should follow format:
```json
{
  "success": true,
  "message": "Description",
  "data": { /* actual data */ }
}
```

- [ ] Admin users endpoint returns correct format
- [ ] Admin pets endpoint returns correct format
- [ ] Status update endpoint returns correct format
- [ ] Pet moderation endpoint returns correct format

### Error Responses

- [ ] 401 Unauthorized for invalid token
- [ ] 403 Forbidden for non-admin user
- [ ] 404 Not Found for missing resource
- [ ] 400 Bad Request for invalid input
- [ ] 500 Server Error handled gracefully

### Data Validation

- [ ] Dates in correct format (ISO 8601)
- [ ] Numbers are numbers, not strings
- [ ] Booleans are boolean type
- [ ] Null values handled correctly
- [ ] Empty lists return `[]` not null

## Phase 7: Mobile/Web Responsiveness

### Mobile (Expo/React Native)

- [ ] Admin screens render correctly on mobile
- [ ] Touch targets are adequate (44x44 pt minimum)
- [ ] Scrollable on small screens
- [ ] Text is readable at default size
- [ ] List items don't overlap
- [ ] Buttons are easily tapable

### Web (If applicable)

- [ ] Admin screens render in browser
- [ ] Responsive on desktop, tablet, mobile
- [ ] Forms submit correctly
- [ ] No console errors

## Phase 8: Error Handling & Edge Cases

### Network Errors
- [ ] Backend offline: shows error message
- [ ] Slow network: shows loading indicator
- [ ] Connection timeout: shows retry button
- [ ] Network recovery: automatically retries

### Data Errors
- [ ] User not found: shows error
- [ ] Pet not found: shows error
- [ ] Invalid status value: rejected with message
- [ ] Missing required fields: validation error shown

### Edge Cases
- [ ] User with 0 pets
- [ ] Pet with no photos
- [ ] User with very long name
- [ ] Pet bio with special characters
- [ ] Location with special characters
- [ ] Very old creation date (before 2020)
- [ ] Future date (shouldn't happen but handle it)

## Phase 9: Security

### Authentication
- [ ] Non-admin users cannot access admin endpoints
- [ ] JWT token required for all endpoints
- [ ] Expired tokens rejected (need re-login)
- [ ] Invalid token format rejected

### Authorization
- [ ] Regular user cannot update another user's status
- [ ] Regular user cannot access admin dashboard
- [ ] Only ADMIN role can access moderation features
- [ ] Attempted unauthorized access returns 403

### Data Privacy
- [ ] Admin cannot see passwords
- [ ] Sensitive data not logged
- [ ] API responses don't expose system details

## Phase 10: Performance & Load

### Response Times
- [ ] Dashboard loads in < 1 second
- [ ] User list loads in < 2 seconds
- [ ] Pet list (50 items) loads in < 2 seconds
- [ ] User search completes in < 1 second
- [ ] Status update processes in < 1 second

### Concurrent Users
- [ ] System handles multiple admin sessions
- [ ] No conflicts between simultaneous updates
- [ ] Database locks handled correctly
- [ ] No race conditions

### Load Testing (Optional)
- [ ] Stress test with 100 requests/second
- [ ] Database handles concurrent reads
- [ ] API remains responsive under load

## Phase 11: User Experience

### UI/UX
- [ ] Loading indicators show during fetches
- [ ] Error messages are clear and actionable
- [ ] Success messages confirm actions
- [ ] No broken images or missing assets
- [ ] Colors contrast is readable
- [ ] Fonts are legible

### Navigation
- [ ] Back button works from all screens
- [ ] Can navigate back to dashboard anytime
- [ ] Breadcrumbs show navigation path (if applicable)
- [ ] Deep linking works (direct URLs)

### Accessibility (if required)
- [ ] Screen reader compatible (basic)
- [ ] Keyboard navigation works
- [ ] Color not the only way to convey info
- [ ] Focus indicators visible

## Phase 12: Data Consistency

### Consistency Tests
- [ ] Update status in admin
- [ ] Refresh user list
- [ ] Status is still updated
- [ ] No data loss on refresh

### Concurrent Modifications
- [ ] Two admins modify same user simultaneously
- [ ] Last modification wins (no conflicts)
- [ ] No duplicate updates

### Audit Trail (if available)
- [ ] All admin actions logged
- [ ] Admin who made changes recorded
- [ ] Timestamp accurate
- [ ] Can view modification history

## Phase 13: Logout & Session

- [ ] Admin logout clears JWT token
- [ ] Cannot access admin features after logout
- [ ] Asking for login again works
- [ ] Session timeout after inactivity (if configured)
- [ ] Session persists across page refresh (while valid)

## Test Results Summary

| Phase | Status | Notes | Date |
|-------|--------|-------|------|
| Pre-Test Setup | ☐ Pass ☐ Fail | | |
| Backend Connectivity | ☐ Pass ☐ Fail | | |
| Admin Dashboard UI | ☐ Pass ☐ Fail | | |
| User Management | ☐ Pass ☐ Fail | | |
| Pet Moderation | ☐ Pass ☐ Fail | | |
| Advanced Filtering | ☐ Pass ☐ Fail | | |
| API Validation | ☐ Pass ☐ Fail | | |
| Responsiveness | ☐ Pass ☐ Fail | | |
| Error Handling | ☐ Pass ☐ Fail | | |
| Security | ☐ Pass ☐ Fail | | |
| Performance | ☐ Pass ☐ Fail | | |
| UX/UI | ☐ Pass ☐ Fail | | |
| Data Consistency | ☐ Pass ☐ Fail | | |
| Session Management | ☐ Pass ☐ Fail | | |

## Issues Found

| ID | Phase | Issue | Severity | Status | Notes |
|----|-------|-------|----------|--------|-------|
| 1 | | | ☐ Critical ☐ Major ☐ Minor | ☐ Open ☐ Fixed | |
| 2 | | | ☐ Critical ☐ Major ☐ Minor | ☐ Open ☐ Fixed | |
| 3 | | | ☐ Critical ☐ Major ☐ Minor | ☐ Open ☐ Fixed | |

## Sign-Off

**Tester Name:** ___________________  
**Date:** ___________________  
**Status:** ☐ PASSED ☐ FAILED ☐ PASSED WITH ISSUES

**Overall Notes:**
_________________________________________________________________________
_________________________________________________________________________

---

**Version:** 1.0  
**Last Updated:** April 15, 2026  
**Environment:** Local Development (MongoDB + Spring Boot + React Native)
