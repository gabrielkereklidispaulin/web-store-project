const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testOrderCreation() {
  console.log('🔍 Testing Order Creation...\n');

  try {
    // Get a product first
    const products = await axios.get(`${API_BASE}/products`);
    const product = products.data.data.products[0];
    console.log(`✅ Found product: ${product.name} (ID: ${product._id})`);

    // Test order data (similar to what frontend sends)
    const orderData = {
      items: [{ 
        product: product._id, 
        quantity: 1 
      }],
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      phone: '+46 70 123 4567',
      shippingAddress: {
        street: 'Test Street 123',
        city: 'Stockholm',
        zipCode: '111 22',
        country: 'Sweden'
      },
      payment: {
        method: 'card'
      }
    };

    console.log('\n📦 Creating order...');
    console.log('Order data:', JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${API_BASE}/orders`, orderData);
    console.log('✅ Order created successfully!');
    console.log(`Order Number: ${response.data.data.order.orderNumber}`);
    console.log(`Total: ${response.data.data.order.pricing.total} SEK`);

  } catch (error) {
    console.error('❌ Order creation failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full response:', error.response?.data);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 This is a server error. Check the backend console for detailed logs.');
    }
  }
}

testOrderCreation();


