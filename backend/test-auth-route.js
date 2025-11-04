const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testAuthRoute() {
  console.log('🔍 Testing Auth Route...\n');

  try {
    // Test 1: Try to register a user
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${registerResponse.data.data.user._id}`);
    } catch (registerError) {
      if (registerError.response?.status === 400 && registerError.response?.data?.message?.includes('already exists')) {
        console.log('✅ User already exists (expected)');
      } else {
        console.error('❌ Registration error:', registerError.response?.data || registerError.message);
        return;
      }
    }

    // Test 2: Try to login
    console.log('\n2️⃣ Testing Login...');
    const loginData = {
      email: 'testuser@example.com',
      password: 'password123'
    };

    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
      console.log('✅ Login successful!');
      console.log(`   Token: ${loginResponse.data.data.token.substring(0, 20)}...`);
      console.log(`   User: ${loginResponse.data.data.user.firstName} ${loginResponse.data.data.user.lastName}`);
    } catch (loginError) {
      console.error('❌ Login error:', loginError.response?.data || loginError.message);
      console.error('   Status:', loginError.response?.status);
    }

  } catch (error) {
    console.error('❌ General error:', error.message);
  }
}

testAuthRoute();


