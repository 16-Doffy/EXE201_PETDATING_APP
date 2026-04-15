# Seed Data Generation Guide

This guide explains how to populate the MongoDB database with fake data for local development and testing.

## Prerequisites

- MongoDB running locally (`mongod` service)
- MongoDB Compass (optional, for visual verification)
- Node.js 18+ installed
- Project dependencies installed: `npm install`

## Setup

### 1. Install Seed Script Dependencies

```bash
npm install mongodb @faker-js/faker --save-dev
```

### 2. Start MongoDB

```bash
# Windows (if installed via installer)
mongod

# Or using Windows Services
net start MongoDB

# Or using MongoDB Atlas connection string in the script
```

Verify MongoDB is running:
```bash
mongosh
# type: exit to quit
```

### 3. Run Seed Script

```bash
# Generate fake data
node scripts/seed-data.js

# Verify data was inserted
node scripts/verify-seed.js
```

## What Gets Generated

The seed script generates **1,254 fake documents** across 8 collections:

| Collection | Count | Purpose |
|-----------|-------|---------|
| **users** | 100 | User accounts with profiles |
| **pets** | 150 | Pet profiles with photos and interests |
| **matches** | 50 | Compatible pet matches |
| **likes** | 199 | Pet likes/favorites |
| **conversations** | 30 | Chat conversations between pets |
| **messages** | 500 | Chat messages |
| **posts** | 75 | Social feed posts |
| **comments** | 300 | Comments on posts |

## Data Structure

### Users

```javascript
{
  _id: ObjectId,
  email: "user123@example.com",
  password: "$2b$10$..." // hashed
  name: "John Doe",
  phone: "+1-555-..." ,
  avatar: "https://dicebear.com/api/...",
  bio: "Dog lover",
  location: "New York",
  verified: true,
  status: "active",
  roles: [],
  createdAt: Date,
  updatedAt: Date
}
```

### Pets

```javascript
{
  _id: ObjectId,
  ownerId: ObjectId, // references user
  name: "Bulldog 1",
  species: "dog", // dog, cat, bird, rabbit, hamster, guinea_pig
  breed: "Labrador",
  age: 6, // years
  gender: "male",
  weight: 25.4, // kg
  bio: "Friendly and playful",
  photos: ["https://...", "https://...", "https://..."],
  interests: ["walking", "playing", "socializing"],
  location: "New York",
  isOnline: false,
  status: "active",
  distance: 5, // km
  createdAt: Date,
  updatedAt: Date
}
```

### Matches

```javascript
{
  _id: ObjectId,
  pet1Id: ObjectId,
  pet2Id: ObjectId,
  matchedAt: Date,
  status: "mutual", // mutual, pending, rejected
  lastInteraction: Date
}
```

### Messages

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  fromPetId: ObjectId,
  toPetId: ObjectId,
  content: "Hello! How are you?",
  isRead: false,
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Change Data Volume

Edit `scripts/seed-data.js` to adjust quantities:

```javascript
// Around line 170-230, modify the loop counts:
for (let i = 0; i < 100; i++) { ... } // Change 100 to desired user count
for (let i = 0; i < 150; i++) { ... } // Change 150 to desired pet count
for (let i = 0; i < 500; i++) { ... } // Change 500 to desired message count
```

### Change Database/URI

Edit the constants in `scripts/seed-data.js`:

```javascript
const MONGO_URI = 'mongodb://localhost:27017'; // Change if using Atlas
const DB_NAME = 'bosistive'; // Change database name
```

## Verification

### Using MongoDB Compass

1. Open **MongoDB Compass**
2. Connect to `mongodb://localhost:27017`
3. Navigate to **bosistive** database
4. View each collection to see the seeded data

### Using Terminal

```bash
# Run verification script
node scripts/verify-seed.js

# Or using mongosh
mongosh
> use bosistive
> db.users.countDocuments()
> db.pets.findOne()
> db.conversations.findOne()
```

## Troubleshooting

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED
```

**Solution:** Make sure MongoDB is running:
```bash
mongod
# or restart the service
```

### Duplicate Key Error

```
E11000 duplicate key error
```

**Solution:** The script automatically drops indexes. If this error persists:
```bash
# Clean the database manually
mongosh
> use bosistive
> db.dropDatabase()
> exit

# Then re-run seed script
node scripts/seed-data.js
```

### Module Not Found

```
Error: Cannot find module 'mongodb'
```

**Solution:** Install dependencies:
```bash
npm install mongodb @faker-js/faker --save-dev
```

## Using Seeded Data

Once the data is seeded:

1. **Backend API** can query the MongoDB collections directly
2. **Frontend** can fetch data via API endpoints
3. **Testing** can use this data for integration tests

### Example API Calls

```bash
# Get all users
curl http://localhost:8080/users

# Get user's pets
curl http://localhost:8080/users/123/pets

# Get conversations
curl http://localhost:8080/conversations

# Send message
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"...", "content":"Hi!"}'
```

## Re-seeding

To generate fresh data:

```bash
# Clear and reseed
node scripts/seed-data.js

# Verify new data
node scripts/verify-seed.js
```

The script automatically:
- ✅ Clears all existing collections
- ✅ Drops old indexes
- ✅ Generates new fake data
- ✅ Inserts into MongoDB

## Performance Notes

- **Seed time:** ~2-5 seconds for 1,254 documents
- **Database size:** ~5-10 MB depending on photo URLs
- **Safe to run multiple times:** Previous data is automatically cleared

## Next Steps

1. ✅ Ensure MongoDB is running (`mongod`)
2. ✅ Run `node scripts/seed-data.js`
3. ✅ Verify with `node scripts/verify-seed.js`
4. ✅ Start your backend: `mvn spring-boot:run`
5. ✅ Start your frontend: `npm start`
6. ✅ Test API endpoints with seeded data

## Support

For issues or questions:
- Check MongoDB connection with `mongosh`
- Verify directory paths (run from project root)
- Check Node.js version: `node --version` (should be 18+)
- Review seed script logs for detailed error messages
