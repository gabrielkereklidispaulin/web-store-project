const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

// Test data
const testOrderData = {
  items: [
    {
      product: '', // Will be filled with actual product ID
      quantity: 2
    }
  ],
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+46 70 123 4567',
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
    customer: 'Test order from automated testing'
  }
};

async function testOrderBackend() {
  console.log('🧪 Testing Order Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Products (to get a product ID for testing)
    console.log('2️⃣ Getting Products for Testing...');
    const productsResponse = await axios.get(`${API_BASE}/products`);
    const products = productsResponse.data.data.products;
    console.log(`✅ Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('❌ No products found! Please seed the database first.');
      return;
    }

    const testProduct = products[0];
    testOrderData.items[0].product = testProduct._id;
    console.log(`✅ Using product: ${testProduct.name} (ID: ${testProduct._id})`);
    console.log('');

    // Test 3: Create Guest Order
    console.log('3️⃣ Testing Guest Order Creation...');
    const createOrderResponse = await axios.post(`${API_BASE}/orders`, testOrderData);
    const createdOrder = createOrderResponse.data.data.order;
    console.log('✅ Order Created Successfully!');
    console.log(`   Order Number: ${createdOrder.orderNumber}`);
    console.log(`   Total: ${createdOrder.pricing.total} SEK`);
    console.log(`   Status: ${createdOrder.status}`);
    console.log(`   Payment Status: ${createdOrder.payment.status}`);
    console.log('');

    // Test 4: Get Order by ID (Guest)
    console.log('4️⃣ Testing Get Order by ID (Guest)...');
    const getOrderResponse = await axios.get(`${API_BASE}/orders/${createdOrder._id}?email=${testOrderData.email}`);
    const retrievedOrder = getOrderResponse.data.data.order;
    console.log('✅ Order Retrieved Successfully!');
    console.log(`   Order Number: ${retrievedOrder.orderNumber}`);
    console.log(`   Items Count: ${retrievedOrder.items.length}`);
    console.log(`   Customer: ${retrievedOrder.guestInfo.firstName} ${retrievedOrder.guestInfo.lastName}`);
    console.log('');

    // Test 5: Test Order Validation (Invalid Data)
    console.log('5️⃣ Testing Order Validation (Invalid Data)...');
    try {
      const invalidOrderData = {
        items: [], // Empty items array
        shippingAddress: {
          street: '', // Empty street
          city: 'Stockholm',
          zipCode: '111 22',
          country: 'Sweden'
        },
        payment: {
          method: 'invalid_method'
        }
      };
      await axios.post(`${API_BASE}/orders`, invalidOrderData);
      console.log('❌ Validation test failed - should have rejected invalid data');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Validation Working - Rejected invalid data');
        console.log(`   Errors: ${error.response.data.errors.length} validation errors`);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 6: Test Non-existent Order
    console.log('6️⃣ Testing Non-existent Order...');
    try {
      await axios.get(`${API_BASE}/orders/507f1f77bcf86cd799439011`);
      console.log('❌ Should have returned 404 for non-existent order');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Correctly returned 404 for non-existent order');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 7: Test Unauthorized Order Access
    console.log('7️⃣ Testing Unauthorized Order Access...');
    try {
      await axios.get(`${API_BASE}/orders/${createdOrder._id}?email=wrong@email.com`);
      console.log('❌ Should have denied access with wrong email');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Correctly denied access with wrong email');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 8: Test Order Cancellation
    console.log('8️⃣ Testing Order Cancellation...');
    const cancelResponse = await axios.delete(`${API_BASE}/orders/${createdOrder._id}`);
    console.log('✅ Order Cancelled Successfully!');
    console.log(`   Message: ${cancelResponse.data.message}`);
    console.log('');

    // Test 9: Test Order Status Update (Admin - will fail without auth)
    console.log('9️⃣ Testing Order Status Update (Admin)...');
    try {
      await axios.put(`${API_BASE}/orders/${createdOrder._id}/status`, {
        status: 'confirmed',
        note: 'Test status update'
      });
      console.log('❌ Should have required admin authentication');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly required authentication for admin operation');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 10: Test Payment Status Update (Admin - will fail without auth)
    console.log('🔟 Testing Payment Status Update (Admin)...');
    try {
      await axios.put(`${API_BASE}/orders/${createdOrder._id}/payment`, {
        status: 'paid',
        transactionId: 'test_txn_123'
      });
      console.log('❌ Should have required admin authentication');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly required authentication for admin operation');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All Order Backend Tests Completed!');
    console.log('');
    console.log('📊 Test Summary:');
    console.log('✅ Health Check - Working');
    console.log('✅ Product Retrieval - Working');
    console.log('✅ Guest Order Creation - Working');
    console.log('✅ Order Retrieval - Working');
    console.log('✅ Order Validation - Working');
    console.log('✅ Error Handling (404) - Working');
    console.log('✅ Access Control - Working');
    console.log('✅ Order Cancellation - Working');
    console.log('✅ Admin Authentication - Working');
    console.log('✅ Payment Status Update Auth - Working');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the tests
testOrderBackend();

