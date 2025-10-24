const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Simple products route without middleware
app.get('/api/products', async (req, res) => {
  try {
    console.log('Products route called');
    
    // Test if Product model can be loaded
    const Product = require('./src/models/Product');
    console.log('Product model loaded');
    
    // Try to find products
    const products = await Product.find({ status: 'active' }).limit(5);
    console.log(`Found ${products.length} products`);
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: 1,
          pages: 1,
          total: products.length,
          limit: 5
        }
      }
    });
    
  } catch (error) {
    console.error('Error in products route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Test route working!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🧪 Test server running on port ${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/test`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Products: http://localhost:${PORT}/api/products`);
});

