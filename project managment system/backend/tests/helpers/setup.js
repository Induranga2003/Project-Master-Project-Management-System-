const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Setup in-memory MongoDB for testing
 */
async function setupTestDB() {
  // Close any existing connections first
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

/**
 * Clean up test database
 */
async function teardownTestDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}

/**
 * Clear all collections
 */
async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

module.exports = {
  setupTestDB,
  teardownTestDB,
  clearDatabase
};

