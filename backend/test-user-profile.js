const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testUserProfile() {
  console.log('🧪 Testing User Profile Functionality...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing User Registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
    console.log('✅ User registered successfully!');
    console.log(`   User ID: ${registerResponse.data.data.user._id}`);
    console.log(`   Email: ${registerResponse.data.data.user.email}`);
    console.log(`   Token: ${registerResponse.data.data.token.substring(0, 20)}...`);
    console.log('');

    const token = registerResponse.data.data.token;
    const userId = registerResponse.data.data.user._id;

    // Test 2: Get user profile
    console.log('2️⃣ Testing Get User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved successfully!');
    console.log(`   Name: ${profileResponse.data.data.user.firstName} ${profileResponse.data.data.user.lastName}`);
    console.log(`   Email: ${profileResponse.data.data.user.email}`);
    console.log('');

    // Test 3: Update user profile
    console.log('3️⃣ Testing Profile Update...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'TestUser',
      phone: '+46 70 123 4567',
      address: {
        street: 'Test Street 123',
        city: 'Stockholm',
        zipCode: '111 22',
        country: 'Sweden'
      },
      preferences: {
        newsletter: true,
        notifications: {
          email: true,
          sms: false
        }
      }
    };

    const updateResponse = await axios.put(`${API_BASE}/auth/profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated successfully!');
    console.log(`   Updated Name: ${updateResponse.data.data.user.firstName} ${updateResponse.data.data.user.lastName}`);
    console.log(`   Phone: ${updateResponse.data.data.user.phone}`);
    console.log(`   Newsletter: ${updateResponse.data.data.user.preferences.newsletter}`);
    console.log('');

    // Test 4: Get user orders (should be empty for new user)
    console.log('4️⃣ Testing Order History...');
    const ordersResponse = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Orders retrieved successfully!');
    console.log(`   Order Count: ${ordersResponse.data.data.orders.length}`);
    console.log('');

    console.log('🎉 All User Profile tests passed!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('✅ User Registration - Working');
    console.log('✅ Profile Retrieval - Working');
    console.log('✅ Profile Update - Working');
    console.log('✅ Order History - Working');
    console.log('');
    console.log('🔑 Test Account Details:');
    console.log(`   Email: ${registerData.email}`);
    console.log(`   Password: ${registerData.password}`);
    console.log('   You can use these credentials to log in and test the frontend!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testUserProfile();

