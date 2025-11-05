const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testLoggedInOrder() {
  console.log('🔍 Testing Logged-in User Order Creation...\n');

  try {
    // First, let's register and login to get a token
    console.log('1️⃣ Registering test user...');
    const registerData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123'
    };

    try {
      await axios.post(`${API_BASE}/auth/register`, registerData);
      console.log('✅ User registered');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('✅ User already exists (expected)');
      } else {
        throw error;
      }
    }

    // Login to get token
    console.log('\n2️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');

    // Get a product
    console.log('\n3️⃣ Getting product...');
    const products = await axios.get(`${API_BASE}/products`);
    const product = products.data.data.products[0];
    console.log(`✅ Found product: ${product.name}`);

    // Test order data (what frontend sends when logged in)
    console.log('\n4️⃣ Creating order (logged in user)...');
    const orderData = {
      items: [{ 
        product: product._id, 
        quantity: 1 
      }],
      shippingAddress: {
        street: 'Test Street 123',
        city: 'Stockholm',
        zipCode: '111 22',
        country: 'Sweden'
      },
      billingAddress: {
        street: 'Test Street 123',
        city: 'Stockholm',
        zipCode: '111 22',
        country: 'Sweden'
      },
      payment: {
        method: 'card'
      },
      notes: {
        customer: 'Test order from logged in user'
      }
    };

    console.log('Order data:', JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Order created successfully!');
    console.log(`Order Number: ${response.data.data.order.orderNumber}`);
    console.log(`Total: ${response.data.data.order.pricing.total} SEK`);

  } catch (error) {
    console.error('❌ Order creation failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full response:', error.response?.data);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 This is a server error. The issue might be:');
      console.log('   - Missing required fields');
      console.log('   - Data validation error');
      console.log('   - Database connection issue');
      console.log('   - Order model validation error');
    }
  }
}

testLoggedInOrder();



