const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const Product = require('./src/models/Product');

async function testOrderModel() {
  console.log('🔍 Testing Order Model Directly...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('✅ Connected to MongoDB');

    // Get a product
    const product = await Product.findOne();
    console.log(`✅ Found product: ${product.name}`);

    // Create a simple order
    const orderData = {
      items: [{
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || '/placeholder.jpg'
      }],
      guestInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+46 70 123 4567'
      },
      pricing: {
        subtotal: product.price,
        shipping: 50,
        tax: 0,
        total: product.price + 50
      },
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
        method: 'card',
        status: 'pending'
      },
      notes: {
        customer: 'Test order'
      }
    };

    console.log('Creating order...');
    const order = new Order(orderData);
    await order.save();
    
    console.log('✅ Order created successfully!');
    console.log(`Order Number: ${order.orderNumber}`);
    console.log(`Total: ${order.pricing.total} SEK`);
    console.log(`Status: ${order.status}`);

    // Clean up
    await Order.findByIdAndDelete(order._id);
    console.log('✅ Test order cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testOrderModel();

