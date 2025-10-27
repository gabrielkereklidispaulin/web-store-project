const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function quickTest() {
  console.log('🧪 Quick Order Backend Test...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Health Check...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is running');
    console.log('');

    // Test 2: Check if orders route exists
    console.log('2️⃣ Testing Orders Route...');
    try {
      const orders = await axios.get(`${API_BASE}/orders`);
      console.log('✅ Orders route is accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Orders route exists (authentication required)');
      } else if (error.response?.status === 404) {
        console.log('❌ Orders route NOT FOUND - Server needs restart');
        console.log('   Please restart the backend server and try again');
        return;
      } else {
        console.log('❌ Unexpected error:', error.message);
        return;
      }
    }
    console.log('');

    // Test 3: Get a product for testing
    console.log('3️⃣ Getting Product for Testing...');
    const products = await axios.get(`${API_BASE}/products`);
    const product = products.data.data.products[0];
    console.log(`✅ Found product: ${product.name}`);
    console.log('');

    // Test 4: Create a simple order
    console.log('4️⃣ Testing Order Creation...');
    const orderData = {
      items: [{ product: product._id, quantity: 1 }],
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '+46 70 123 4567',
      shippingAddress: {
        street: 'Test Street 123',
        city: 'Stockholm',
        zipCode: '111 22',
        country: 'Sweden'
      },
      payment: { method: 'card' }
    };

    const order = await axios.post(`${API_BASE}/orders`, orderData);
    console.log('✅ Order created successfully!');
    console.log(`   Order Number: ${order.data.data.order.orderNumber}`);
    console.log(`   Total: ${order.data.data.order.pricing.total} SEK`);
    console.log('');

    console.log('🎉 All tests passed! Order backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

quickTest();

