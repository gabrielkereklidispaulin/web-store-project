const mongoose = require('mongoose');
const User = require('./src/models/User');

async function cleanupAndTest() {
  console.log('🧹 Cleaning up and testing User Model...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('✅ Connected to MongoDB');

    // Clean up existing test user
    await User.deleteOne({ email: 'testuser@example.com' });
    console.log('✅ Cleaned up existing test user');

    // Test user creation
    console.log('Creating new test user...');
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();
    
    console.log('✅ User created successfully!');
    console.log(`User ID: ${user._id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);

    // Test password comparison
    const isPasswordValid = await user.comparePassword('password123');
    console.log(`✅ Password comparison: ${isPasswordValid}`);

    // Test toJSON method (should not include password)
    const userJSON = user.toJSON();
    console.log(`✅ Password removed from JSON: ${!userJSON.password}`);

    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log('✅ Test user cleaned up');

    console.log('\n🎉 User Model is working correctly!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

cleanupAndTest();


