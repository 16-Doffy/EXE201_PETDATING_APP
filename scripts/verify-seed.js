/**
 * Verify seeded data
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'bosistive';

async function verifySeed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collections = ['users', 'pets', 'matches', 'likes', 'conversations', 'messages', 'posts', 'comments'];
    
    console.log('\n📊 Collection Counts:');
    for (const col of collections) {
      const count = await db.collection(col).countDocuments();
      console.log(`  ${col}: ${count} documents`);
    }

    // Show sample user
    const user = await db.collection('users').findOne();
    console.log('\n👤 Sample User:');
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Location: ${user.location}`);

    // Show sample pet
    const pet = await db.collection('pets').findOne();
    console.log('\n🐾 Sample Pet:');
    console.log(`  Name: ${pet.name}`);
    console.log(`  Species: ${pet.species}`);
    console.log(`  Breed: ${pet.breed}`);
    console.log(`  Age: ${pet.age} years`);

  } finally {
    await client.close();
  }
}

verifySeed().catch(console.error);
