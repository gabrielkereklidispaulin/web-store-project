const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testUserModel() {
  console.log('🔍 Testing User Model Directly...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('✅ Connected to MongoDB');

    // Test user creation
    console.log('Creating test user...');
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

    // Clean up
    await User.findByIdAndDelete(user._id);
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testUserModel();



