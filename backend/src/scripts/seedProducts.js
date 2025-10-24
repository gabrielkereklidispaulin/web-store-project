const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Fake Store API endpoint
const FAKE_STORE_API = 'https://fakestoreapi.com/products';

// Custom product data that matches our images perfectly
const customProducts = [
  {
    name: "Minimalist Canvas Slingbag",
    category: "Accessories",
    price: 1295, // SEK - Premium canvas bag
    originalPrice: 1620, // SEK - On sale!
    image: "bag_1.avif",
    description: "Clean, functional slingbag in premium canvas. Perfect for daily use with adjustable strap and compact design.",
    tags: ["slingbag", "canvas", "minimalist", "daily-use"]
  },
  {
    name: "Modern Wool Blazer",
    category: "Men's Clothing", 
    price: 3895, // SEK - Premium tailored blazer
    image: "blazer_1.avif",
    description: "Contemporary wool blazer with modern tailoring. Clean lines and functional pockets for a sophisticated look.",
    tags: ["blazer", "wool", "modern", "tailored"]
  },
  {
    name: "Vintage Baseball Cap",
    category: "Accessories",
    price: 495, // SEK - Basic cap
    image: "cap_1.avif", 
    description: "Retro-style baseball cap in soft cotton. Adjustable fit with classic curved brim.",
    tags: ["cap", "baseball", "vintage", "cotton"]
  },
  {
    name: "Cozy Wool Cardigan",
    category: "Women's Clothing",
    price: 1895, // SEK - Premium wool cardigan
    originalPrice: 2370, // SEK - On sale!
    image: "cardigan_1.avif",
    description: "Soft wool cardigan with button closure. Perfect layering piece for transitional weather.",
    tags: ["cardigan", "wool", "layering", "buttons"]
  },
  {
    name: "Warm Winter Coat",
    category: "Outerwear",
    price: 2895, // SEK - Premium winter coat
    image: "coat_1.avif",
    description: "Insulated winter coat with water-resistant finish. Features hood and multiple pockets.",
    tags: ["coat", "winter", "warm", "water-resistant"]
  },
  {
    name: "Leather Driving Gloves",
    category: "Accessories", 
    price: 1195, // SEK - Premium leather gloves
    image: "gloves_1.avif",
    description: "Premium leather driving gloves with touch-screen compatibility. Classic style meets modern functionality.",
    tags: ["gloves", "leather", "driving", "touch-screen"]
  },
  {
    name: "Oversized Hoodie",
    category: "Casual Wear",
    price: 1295, // SEK - Premium hoodie
    image: "hoodie_1.avif",
    description: "Comfortable oversized hoodie in soft cotton blend. Relaxed fit with kangaroo pocket.",
    tags: ["hoodie", "oversized", "cotton", "casual"]
  },
  {
    name: "Wind Jacket",
    category: "Outerwear",
    price: 1795, // SEK - Premium wind jacket
    originalPrice: 2245, // SEK - On sale!
    image: "jacket_1.avif",
    description: "Lightweight wind jacket with water-resistant finish. Perfect for transitional weather with breathable fabric.",
    tags: ["jacket", "wind", "lightweight", "water-resistant"]
  },
  {
    name: "Cashmere Scarf",
    category: "Accessories",
    price: 2195, // SEK - Luxury cashmere scarf
    image: "scarf_1.avif",
    description: "Luxurious cashmere scarf in neutral tones. Soft, warm, and versatile for any outfit.",
    tags: ["scarf", "cashmere", "luxury", "neutral"]
  },
  {
    name: "Classic Oxford Shirt",
    category: "Men's Clothing",
    price: 1195, // SEK - Premium Oxford shirt
    image: "shirt_1.avif",
    description: "Crisp Oxford shirt in premium cotton. Classic button-down collar and timeless styling for any occasion.",
    tags: ["shirt", "oxford", "classic", "cotton"]
  },
  {
    name: "Minimalist Sneakers",
    category: "Footwear",
    price: 2395, // SEK - Premium leather sneakers
    originalPrice: 2995, // SEK - On sale!
    image: "sneakers_1.avif",
    description: "Clean, minimalist sneakers in premium leather. Comfortable and versatile for everyday wear.",
    tags: ["sneakers", "minimalist", "leather", "comfortable"]
  },
  {
    name: "Merino Wool Socks",
    category: "Accessories",
    price: 395, // SEK - Premium merino socks
    image: "socks_1.avif",
    description: "Soft merino wool socks with moisture-wicking properties. Perfect for all-day comfort.",
    tags: ["socks", "merino", "wool", "comfort"]
  }
];

// Category mapping for our custom products
const categoryMapping = {
  "Men's Clothing": "Men's Clothing",
  "Women's Clothing": "Women's Clothing", 
  "Accessories": "Accessories",
  "Outerwear": "Outerwear",
  "Casual Wear": "Casual Wear",
  "Footwear": "Footwear"
};

// Function to create categories if they don't exist
async function createCategories() {
  const categories = [];
  
  for (const [key, name] of Object.entries(categoryMapping)) {
    let category = await Category.findOne({ name });
    if (!category) {
      category = new Category({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `${name} products`,
        status: 'active'
      });
      await category.save();
      console.log(`Created category: ${name}`);
    }
    categories.push(category);
  }
  
  return categories;
}

// Function to transform custom product to our Product model
function transformProduct(customProduct, categories) {
  const category = categories.find(cat => 
    cat.name === categoryMapping[customProduct.category]
  );
  
  return {
    name: customProduct.name,
    slug: customProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: customProduct.description,
    shortDescription: customProduct.description.substring(0, 150) + '...',
    price: customProduct.price,
    comparePrice: customProduct.originalPrice || null, // Use original price if on sale, otherwise no compare price
    category: category ? category._id : null,
    images: [
      {
        url: `/images/${customProduct.image}`,
        alt: customProduct.name,
        isPrimary: true
      }
    ],
    inventory: {
      trackQuantity: false, // Don't track stock for proof of concept
      quantity: 999, // Always in stock
      lowStockThreshold: 5,
      allowBackorder: false
    },
    sku: `CUSTOM-${customProduct.name.replace(/[^A-Z0-9]/g, '').substring(0, 8)}`,
    status: 'active',
    featured: Math.random() > 0.6, // 40% chance of being featured
    tags: customProduct.tags,
    ratings: {
      average: Math.random() * 1.5 + 3.5, // Random rating between 3.5-5
      count: Math.floor(Math.random() * 50) + 20
    },
    weight: Math.floor(Math.random() * 3) + 0.5, // Random weight between 0.5-3.5 kg
    dimensions: {
      length: Math.floor(Math.random() * 15) + 10,
      width: Math.floor(Math.random() * 10) + 8,
      height: Math.floor(Math.random() * 8) + 5
    },
    shipping: {
      free: customProduct.price > 75,
      cost: customProduct.price > 75 ? 0 : 9.99
    }
  };
}

// Main seeding function
async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webstore');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Create categories
    const categories = await createCategories();

    // Transform and save custom products
    const products = [];
    for (const customProduct of customProducts) {
      const productData = transformProduct(customProduct, categories);
      const product = new Product(productData);
      await product.save();
      products.push(product);
    }

    console.log(`Successfully seeded ${products.length} custom products`);
    
    // Display some sample products
    console.log('\nSample products:');
    products.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} - $${product.price} (${product.category?.name || 'Uncategorized'})`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts };
