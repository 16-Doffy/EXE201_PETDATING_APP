/**
 * Seed Database Script - Generate fake data for PetDating App
 * Run: node scripts/seed-data.js
 */

const { MongoClient } = require('mongodb');
const faker = require('@faker-js/faker').faker;

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'bosistive';

const petSpecies = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea_pig'];
const petGenders = ['male', 'female'];
const petBreeds = {
  dog: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Husky'],
  cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Bengal'],
  bird: ['Parrot', 'Canary', 'Cockatiel', 'Budgie', 'Finch'],
  rabbit: ['Holland Lop', 'Mini Lop', 'Flemish Giant', 'Dwarf'],
  hamster: ['Syrian', 'Dwarf', 'Roborovski'],
  guinea_pig: ['American', 'Peruvian', 'Silkie']
};

const interests = ['walking', 'swimming', 'playing', 'training', 'socializing', 'cuddling', 'adventures', 'outdoor', 'indoor', 'sports'];

function generateUser(index) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    _id: faker.database.mongodbObjectId(),
    email: `user${index}@example.com`,
    password: '$2b$10$abcdefghijklmnopqrstuvwxyz', // hashed 'password123'
    name: `${firstName} ${lastName}`,
    phone: faker.phone.number(),
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}${index}`,
    bio: faker.lorem.sentences(2),
    location: faker.location.city(),
    verified: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(['active', 'inactive', 'banned']),
    roles: [],
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generatePet(index, userId) {
  const species = faker.helpers.arrayElement(petSpecies);
  const breeds = petBreeds[species];
  const petName = faker.animal.dog();
  return {
    _id: faker.database.mongodbObjectId(),
    ownerId: userId,
    name: petName + ' ' + index,
    species: species,
    breed: faker.helpers.arrayElement(breeds),
    age: faker.number.int({ min: 1, max: 15 }),
    gender: faker.helpers.arrayElement(petGenders),
    weight: faker.number.float({ min: 1, max: 50, precision: 0.1 }),
    bio: faker.lorem.sentence(),
    photos: [
      `https://api.dicebear.com/9.x/avataaars/svg?seed=pet${index}1`,
      `https://api.dicebear.com/9.x/avataaars/svg?seed=pet${index}2`,
      `https://api.dicebear.com/9.x/avataaars/svg?seed=pet${index}3`
    ],
    interests: faker.helpers.shuffle(interests).slice(0, faker.number.int({ min: 2, max: 5 })),
    location: faker.location.city(),
    isOnline: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    distance: faker.number.int({ min: 1, max: 100 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generateMatch(petId1, petId2) {
  return {
    _id: faker.database.mongodbObjectId(),
    pet1Id: petId1,
    pet2Id: petId2,
    matchedAt: faker.date.past(),
    status: faker.helpers.arrayElement(['mutual', 'pending', 'rejected']),
    lastInteraction: faker.date.recent()
  };
}

function generateLike(petId1, petId2) {
  return {
    _id: faker.database.mongodbObjectId(),
    fromPetId: petId1,
    toPetId: petId2,
    likedAt: faker.date.past(),
    type: faker.helpers.arrayElement(['like', 'super_like', 'dislike'])
  };
}

function generateConversation(petId1, petId2) {
  return {
    _id: faker.database.mongodbObjectId(),
    participants: [petId1, petId2],
    lastMessage: faker.lorem.sentence(),
    lastMessageTime: faker.date.recent(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generateMessage(conversationId, fromPetId, toPetId) {
  return {
    _id: faker.database.mongodbObjectId(),
    conversationId: conversationId,
    fromPetId: fromPetId,
    toPetId: toPetId,
    content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    isRead: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generatePost(petId) {
  const postId = faker.database.mongodbObjectId();
  return {
    _id: postId,
    petId: petId,
    content: faker.lorem.paragraph(),
    images: [`https://api.dicebear.com/9.x/avataaars/svg?seed=post${postId}`],
    likes: faker.number.int({ min: 0, max: 500 }),
    comments: faker.number.int({ min: 0, max: 100 }),
    shares: faker.number.int({ min: 0, max: 50 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

function generateComment(postId, petId) {
  return {
    _id: faker.database.mongodbObjectId(),
    postId: postId,
    petId: petId,
    content: faker.lorem.sentence(),
    likes: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
}

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Drop existing collections
    console.log('🗑️  Clearing existing collections...');
    const collections = ['users', 'pets', 'matches', 'likes', 'conversations', 'messages', 'posts', 'comments'];
    for (const col of collections) {
      try {
        await db.collection(col).deleteMany({});
        // Drop all indexes for this collection
        try {
          await db.collection(col).dropIndexes();
        } catch (e) {
          // Ignore if no indexes exist
        }
      } catch (e) {
        // Collection doesn't exist, skip
      }
    }

    // 1. Generate Users (100 users)
    console.log('👥 Generating 100 users...');
    const users = Array.from({ length: 100 }, (_, i) => generateUser(i + 1));
    await db.collection('users').insertMany(users);

    // 2. Generate Pets (150 pets, some users have multiple)
    console.log('🐾 Generating 150 pets...');
    const pets = [];
    for (let i = 0; i < 150; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      pets.push(generatePet(i + 1, randomUser._id));
    }
    await db.collection('pets').insertMany(pets);

    // 3. Generate Matches (50 matches)
    console.log('❤️  Generating 50 matches...');
    const matches = [];
    for (let i = 0; i < 50; i++) {
      const pet1 = pets[Math.floor(Math.random() * pets.length)];
      const pet2 = pets[Math.floor(Math.random() * pets.length)];
      if (pet1._id !== pet2._id) {
        matches.push(generateMatch(pet1._id, pet2._id));
      }
    }
    await db.collection('matches').insertMany(matches);

    // 4. Generate Likes (200 likes)
    console.log('👍 Generating 200 likes...');
    const likes = [];
    for (let i = 0; i < 200; i++) {
      const pet1 = pets[Math.floor(Math.random() * pets.length)];
      const pet2 = pets[Math.floor(Math.random() * pets.length)];
      if (pet1._id !== pet2._id) {
        likes.push(generateLike(pet1._id, pet2._id));
      }
    }
    await db.collection('likes').insertMany(likes);

    // 5. Generate Conversations (30 conversations)
    console.log('💬 Generating 30 conversations...');
    const conversations = [];
    for (let i = 0; i < 30; i++) {
      const pet1 = pets[Math.floor(Math.random() * pets.length)];
      const pet2 = pets[Math.floor(Math.random() * pets.length)];
      if (pet1._id !== pet2._id) {
        conversations.push(generateConversation(pet1._id, pet2._id));
      }
    }
    await db.collection('conversations').insertMany(conversations);

    // 6. Generate Messages (500 messages)
    console.log('📧 Generating 500 messages...');
    const messages = [];
    for (let i = 0; i < 500; i++) {
      const conv = conversations[Math.floor(Math.random() * conversations.length)];
      const [petId1, petId2] = conv.participants;
      const fromPet = Math.random() > 0.5 ? petId1 : petId2;
      const toPet = fromPet === petId1 ? petId2 : petId1;
      messages.push(generateMessage(conv._id, fromPet, toPet));
    }
    await db.collection('messages').insertMany(messages);

    // 7. Generate Posts (75 posts)
    console.log('📝 Generating 75 posts...');
    const posts = [];
    for (let i = 0; i < 75; i++) {
      const randomPet = pets[Math.floor(Math.random() * pets.length)];
      posts.push(generatePost(randomPet._id));
    }
    await db.collection('posts').insertMany(posts);

    // 8. Generate Comments (300 comments)
    console.log('💭 Generating 300 comments...');
    const comments = [];
    for (let i = 0; i < 300; i++) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      const randomPet = pets[Math.floor(Math.random() * pets.length)];
      comments.push(generateComment(randomPost._id, randomPet._id));
    }
    await db.collection('comments').insertMany(comments);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`  📊 Users: ${users.length}`);
    console.log(`  🐾 Pets: ${pets.length}`);
    console.log(`  ❤️ Matches: ${matches.length}`);
    console.log(`  👍 Likes: ${likes.length}`);
    console.log(`  💬 Conversations: ${conversations.length}`);
    console.log(`  📧 Messages: ${messages.length}`);
    console.log(`  📝 Posts: ${posts.length}`);
    console.log(`  💭 Comments: ${comments.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Run seed if this is the main module
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };
