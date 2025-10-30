#!/usr/bin/env node

const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Sample data
const sampleCategories = [
  {
    name: "Men's Clothing",
    slug: 'mens-clothing',
    description: "Men's fashion and apparel",
    isActive: true,
    sortOrder: 1
  },
  {
    name: "Women's Clothing",
    slug: 'womens-clothing',
    description: "Women's fashion and apparel",
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Accessories and add-ons',
    isActive: true,
    sortOrder: 3
  },
  {
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Outerwear and jackets',
    isActive: true,
    sortOrder: 4
  },
  {
    name: 'Casual Wear',
    slug: 'casual-wear',
    description: 'Casual wear and everyday clothing',
    isActive: true,
    sortOrder: 5
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Shoes and footwear',
    isActive: true,
    sortOrder: 6
  }
];

const sampleProducts = [
  {
    name: 'Minimalist Canvas Slingbag',
    shortDescription: 'Clean, functional slingbag in premium canvas',
    description: 'Clean, functional slingbag in premium canvas. Perfect for daily use with adjustable strap and compact design.',
    price: 1295,
    comparePrice: 1620,
    sku: 'BAG-001',
    status: 'active',
    featured: true,
    tags: ['slingbag', 'canvas', 'minimalist', 'daily-use'],
    images: [{ url: '/images/bag_1.avif', alt: 'Minimalist Canvas Slingbag', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Modern Wool Blazer',
    shortDescription: 'Contemporary wool blazer with modern tailoring',
    description: 'Contemporary wool blazer with modern tailoring. Clean lines and functional pockets for a sophisticated look.',
    price: 3895,
    comparePrice: null,
    sku: 'BLAZER-001',
    status: 'active',
    featured: true,
    tags: ['blazer', 'wool', 'modern', 'tailored'],
    images: [{ url: '/images/blazer_1.avif', alt: 'Modern Wool Blazer', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Vintage Baseball Cap',
    shortDescription: 'Retro-style baseball cap in soft cotton',
    description: 'Retro-style baseball cap in soft cotton. Adjustable fit with classic curved brim.',
    price: 495,
    comparePrice: null,
    sku: 'CAP-001',
    status: 'active',
    featured: false,
    tags: ['cap', 'baseball', 'vintage', 'cotton'],
    images: [{ url: '/images/cap_1.avif', alt: 'Vintage Baseball Cap', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Cozy Wool Cardigan',
    shortDescription: 'Soft wool cardigan with button closure',
    description: 'Soft wool cardigan with button closure. Perfect layering piece for transitional weather.',
    price: 1895,
    comparePrice: 2370,
    sku: 'CARDIGAN-001',
    status: 'active',
    featured: false,
    tags: ['cardigan', 'wool', 'layering', 'buttons'],
    images: [{ url: '/images/cardigan_1.avif', alt: 'Cozy Wool Cardigan', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Warm Winter Coat',
    shortDescription: 'Insulated winter coat with water-resistant finish',
    description: 'Insulated winter coat with water-resistant finish. Features hood and multiple pockets.',
    price: 2895,
    comparePrice: null,
    sku: 'COAT-001',
    status: 'active',
    featured: true,
    tags: ['coat', 'winter', 'warm', 'water-resistant'],
    images: [{ url: '/images/coat_1.avif', alt: 'Warm Winter Coat', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Leather Driving Gloves',
    shortDescription: 'Premium leather driving gloves with touch-screen compatibility',
    description: 'Premium leather driving gloves with touch-screen compatibility. Classic style meets modern functionality.',
    price: 1195,
    comparePrice: null,
    sku: 'GLOVES-001',
    status: 'active',
    featured: false,
    tags: ['gloves', 'leather', 'driving', 'touch-screen'],
    images: [{ url: '/images/gloves_1.avif', alt: 'Leather Driving Gloves', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Oversized Hoodie',
    shortDescription: 'Comfortable oversized hoodie in soft cotton blend',
    description: 'Comfortable oversized hoodie in soft cotton blend. Relaxed fit with kangaroo pocket.',
    price: 1295,
    comparePrice: null,
    sku: 'HOODIE-001',
    status: 'active',
    featured: true,
    tags: ['hoodie', 'oversized', 'cotton', 'casual'],
    images: [{ url: '/images/hoodie_1.avif', alt: 'Oversized Hoodie', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Wind Jacket',
    shortDescription: 'Lightweight wind jacket with water-resistant finish',
    description: 'Lightweight wind jacket with water-resistant finish. Perfect for transitional weather with breathable fabric.',
    price: 1795,
    comparePrice: 2245,
    sku: 'JACKET-001',
    status: 'active',
    featured: true,
    tags: ['jacket', 'wind', 'lightweight', 'water-resistant'],
    images: [{ url: '/images/jacket_1.avif', alt: 'Wind Jacket', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Cashmere Scarf',
    shortDescription: 'Luxurious cashmere scarf in neutral tones',
    description: 'Luxurious cashmere scarf in neutral tones. Soft, warm, and versatile for any outfit.',
    price: 2195,
    comparePrice: null,
    sku: 'SCARF-001',
    status: 'active',
    featured: false,
    tags: ['scarf', 'cashmere', 'luxury', 'neutral'],
    images: [{ url: '/images/scarf_1.avif', alt: 'Cashmere Scarf', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Classic Oxford Shirt',
    shortDescription: 'Crisp Oxford shirt in premium cotton',
    description: 'Crisp Oxford shirt in premium cotton. Classic button-down collar and timeless styling for any occasion.',
    price: 1195,
    comparePrice: null,
    sku: 'SHIRT-001',
    status: 'active',
    featured: true,
    tags: ['shirt', 'oxford', 'classic', 'cotton'],
    images: [{ url: '/images/shirt_1.avif', alt: 'Classic Oxford Shirt', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Minimalist Sneakers',
    shortDescription: 'Clean, minimalist sneakers in premium leather',
    description: 'Clean, minimalist sneakers in premium leather. Comfortable and versatile for everyday wear.',
    price: 2395,
    comparePrice: 2995,
    sku: 'SNEAKERS-001',
    status: 'active',
    featured: true,
    tags: ['sneakers', 'minimalist', 'leather', 'comfortable'],
    images: [{ url: '/images/sneakers_1.avif', alt: 'Minimalist Sneakers', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
  },
  {
    name: 'Merino Wool Socks',
    shortDescription: 'Soft merino wool socks with moisture-wicking properties',
    description: 'Soft merino wool socks with moisture-wicking properties. Perfect for all-day comfort.',
    price: 395,
    comparePrice: null,
    sku: 'SOCKS-001',
    status: 'active',
    featured: false,
    tags: ['socks', 'merino', 'wool', 'comfort'],
    images: [{ url: '/images/socks_1.avif', alt: 'Merino Wool Socks', isPrimary: true }],
    inventory: { trackQuantity: false, quantity: 999, lowStockThreshold: 5 }
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
    
    // Create users (one at a time to trigger password hashing pre-save hook)
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create products with proper category references
    const categoryMap = {
      "Men's Clothing": createdCategories.find(c => c.name === "Men's Clothing")?._id,
      "Women's Clothing": createdCategories.find(c => c.name === "Women's Clothing")?._id,
      "Accessories": createdCategories.find(c => c.name === "Accessories")?._id,
      "Outerwear": createdCategories.find(c => c.name === "Outerwear")?._id,
      "Casual Wear": createdCategories.find(c => c.name === "Casual Wear")?._id,
      "Footwear": createdCategories.find(c => c.name === "Footwear")?._id
    };
    
    const productsWithCategories = sampleProducts.map((product) => {
      // Determine category from product name/tags
      let categoryId = categoryMap['Accessories']; // default
      
      if (product.name.includes('Blazer') || product.name.includes('Shirt')) {
        categoryId = categoryMap["Men's Clothing"];
      } else if (product.name.includes('Cardigan')) {
        categoryId = categoryMap["Women's Clothing"];
      } else if (product.name.includes('Jacket') || product.name.includes('Coat')) {
        categoryId = categoryMap['Outerwear'];
      } else if (product.name.includes('Hoodie')) {
        categoryId = categoryMap['Casual Wear'];
      } else if (product.name.includes('Sneakers')) {
        categoryId = categoryMap['Footwear'];
      }
      
      return {
        ...product,
        category: categoryId
      };
    });
    
    // Create products one at a time to avoid potential validation issues
    const createdProducts = [];
    for (const productData of productsWithCategories) {
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
    }
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
