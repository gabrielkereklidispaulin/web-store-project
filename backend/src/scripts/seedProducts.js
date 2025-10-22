const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Fake Store API endpoint
const FAKE_STORE_API = 'https://fakestoreapi.com/products';

// Category mapping from Fake Store API to our categories
const categoryMapping = {
  "electronics": "Electronics",
  "jewelery": "Jewelry", 
  "men's clothing": "Men's Clothing",
  "women's clothing": "Women's Clothing"
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

// Function to fetch products from Fake Store API
async function fetchFakeStoreProducts() {
  try {
    console.log('Fetching products from Fake Store API...');
    const response = await axios.get(FAKE_STORE_API);
    return response.data;
  } catch (error) {
    console.error('Error fetching products from Fake Store API:', error);
    throw error;
  }
}

// Function to transform Fake Store product to our Product model
function transformProduct(fakeProduct, categories) {
  const category = categories.find(cat => 
    cat.name.toLowerCase() === categoryMapping[fakeProduct.category]?.toLowerCase()
  );
  
  // Generate additional product images (using placeholder service)
  const additionalImages = [
    `https://picsum.photos/400/400?random=${fakeProduct.id + 100}`,
    `https://picsum.photos/400/400?random=${fakeProduct.id + 200}`,
    `https://picsum.photos/400/400?random=${fakeProduct.id + 300}`
  ];
  
  return {
    name: fakeProduct.title,
    slug: fakeProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: fakeProduct.description,
    shortDescription: fakeProduct.description.substring(0, 150) + '...',
    price: fakeProduct.price,
    comparePrice: fakeProduct.price * 1.2, // Add 20% markup as compare price
    category: category ? category._id : null,
    images: [
      {
        url: fakeProduct.image,
        alt: fakeProduct.title,
        isPrimary: true
      },
      ...additionalImages.map(url => ({
        url,
        alt: fakeProduct.title,
        isPrimary: false
      }))
    ],
    stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
    sku: `FS-${fakeProduct.id.toString().padStart(4, '0')}`,
    status: 'active',
    featured: Math.random() > 0.7, // 30% chance of being featured
    tags: [fakeProduct.category, 'fake-store'],
    ratings: {
      average: fakeProduct.rating?.rate || (Math.random() * 2 + 3), // Random rating between 3-5
      count: fakeProduct.rating?.count || Math.floor(Math.random() * 100) + 10
    },
    weight: Math.floor(Math.random() * 5) + 0.5, // Random weight between 0.5-5.5 kg
    dimensions: {
      length: Math.floor(Math.random() * 20) + 10,
      width: Math.floor(Math.random() * 15) + 8,
      height: Math.floor(Math.random() * 10) + 5
    },
    shipping: {
      free: fakeProduct.price > 50,
      cost: fakeProduct.price > 50 ? 0 : 9.99
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

    // Fetch products from Fake Store API
    const fakeProducts = await fetchFakeStoreProducts();
    console.log(`Fetched ${fakeProducts.length} products from Fake Store API`);

    // Transform and save products
    const products = [];
    for (const fakeProduct of fakeProducts) {
      const productData = transformProduct(fakeProduct, categories);
      const product = new Product(productData);
      await product.save();
      products.push(product);
    }

    console.log(`Successfully seeded ${products.length} products`);
    
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
