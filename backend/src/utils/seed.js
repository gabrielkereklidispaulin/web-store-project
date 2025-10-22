#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

// Sample data
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books and literature',
    isActive: true,
    sortOrder: 3
  }
];

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    shortDescription: 'Wireless headphones with noise cancellation',
    price: 199.99,
    comparePrice: 249.99,
    sku: 'WH-001',
    status: 'active',
    featured: true,
    tags: ['electronics', 'audio', 'wireless'],
    inventory: {
      trackQuantity: true,
      quantity: 50,
      lowStockThreshold: 10
    }
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt in various colors',
    shortDescription: 'Comfortable cotton t-shirt',
    price: 24.99,
    comparePrice: 29.99,
    sku: 'TS-001',
    status: 'active',
    featured: false,
    tags: ['clothing', 'cotton', 'casual'],
    inventory: {
      trackQuantity: true,
      quantity: 100,
      lowStockThreshold: 20
    }
  },
  {
    name: 'JavaScript Guide',
    description: 'Comprehensive guide to modern JavaScript programming',
    shortDescription: 'Modern JavaScript programming guide',
    price: 39.99,
    comparePrice: 49.99,
    sku: 'JS-001',
    status: 'active',
    featured: true,
    tags: ['books', 'programming', 'javascript'],
    inventory: {
      trackQuantity: true,
      quantity: 25,
      lowStockThreshold: 5
    }
  }
];

const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@webstore.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    
    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create products with category references
    const productsWithCategories = sampleProducts.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id
    }));
    
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log(`- ${createdUsers.length} users (including admin)`);
    console.log(`- ${createdCategories.length} categories`);
    console.log(`- ${createdProducts.length} products`);
    console.log('\n🔑 Admin Login:');
    console.log('Email: admin@webstore.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  seedDatabase();
}

module.exports = seedDatabase;
