const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function debugTest() {
  console.log('🔍 Debug Order Creation Test...\n');

  try {
    // Get a product
    const products = await axios.get(`${API_BASE}/products`);
    const product = products.data.data.products[0];
    console.log(`Product: ${product.name}`);
    console.log(`Product ID: ${product._id}`);
    console.log(`Product Inventory:`, product.inventory);
    console.log('');

    // Test order data
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

    console.log('Order Data:', JSON.stringify(orderData, null, 2));
    console.log('');

    // Try to create order
    console.log('Creating order...');
    const order = await axios.post(`${API_BASE}/orders`, orderData);
    console.log('✅ Order created successfully!');
    console.log(`Order Number: ${order.data.data.order.orderNumber}`);

  } catch (error) {
    console.error('❌ Error details:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full response:', error.response?.data);
    
    if (error.response?.status === 500) {
      console.log('\n🔍 This is a server error. Check the backend console for detailed error logs.');
    }
  }
}

debugTest();



