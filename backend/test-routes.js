// Test script to check route loading
console.log('Testing route loading...');

try {
  console.log('1. Testing express...');
  const express = require('express');
  console.log('✅ Express loaded');
  
  console.log('2. Testing mongoose...');
  const mongoose = require('mongoose');
  console.log('✅ Mongoose loaded');
  
  console.log('3. Testing Product model...');
  const Product = require('./src/models/Product');
  console.log('✅ Product model loaded');
  
  console.log('4. Testing auth middleware...');
  const auth = require('./src/middleware/auth');
  console.log('✅ Auth middleware loaded');
  
  console.log('5. Testing products route...');
  const productsRoute = require('./src/routes/products');
  console.log('✅ Products route loaded');
  
  console.log('All routes loaded successfully!');
  
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  console.error('Stack:', error.stack);
}

