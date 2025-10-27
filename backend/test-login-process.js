const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testLoginProcess() {
  console.log('🔍 Testing Login Process...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('✅ Connected to MongoDB');

    // Clean up and create a test user
    await User.deleteOne({ email: 'testuser@example.com' });
    console.log('✅ Cleaned up existing test user');

    // Create a new user
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    const user = new User(userData);
    await user.save();
    console.log('✅ User created successfully!');

    // Test login process
    console.log('\n🔐 Testing Login Process...');
    
    // Step 1: Find user by email
    const foundUser = await User.findOne({ email: 'testuser@example.com' });
    console.log(`✅ User found: ${foundUser ? 'Yes' : 'No'}`);
    
    if (foundUser) {
      // Step 2: Check if user is active
      console.log(`✅ User is active: ${foundUser.isActive}`);
      
      // Step 3: Test password comparison
      try {
        const isPasswordValid = await foundUser.comparePassword('password123');
        console.log(`✅ Password comparison: ${isPasswordValid}`);
        
        if (isPasswordValid) {
          console.log('✅ Login process would succeed!');
        } else {
          console.log('❌ Password comparison failed');
        }
      } catch (passwordError) {
        console.error('❌ Password comparison error:', passwordError.message);
      }
    }

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

testLoginProcess();

