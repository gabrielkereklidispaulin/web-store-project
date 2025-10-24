// Test script to check product images
const axios = require('axios');

async function testImages() {
  try {
    console.log('Testing product images...');
    
    const response = await axios.get('http://localhost:3001/api/products');
    const products = response.data.data.products;
    
    console.log(`Found ${products.length} products`);
    console.log('\nFirst 3 products and their image URLs:');
    
    products.slice(0, 3).forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   Image URL: ${product.images?.[0]?.url || 'No image'}`);
      
      // Test if the image URL is accessible
      if (product.images?.[0]?.url) {
        console.log(`   Testing image accessibility...`);
        axios.head(product.images[0].url, { timeout: 5000 })
          .then(() => console.log(`   ✅ Image accessible`))
          .catch(err => console.log(`   ❌ Image failed: ${err.message}`));
      }
    });
    
  } catch (error) {
    console.error('Error testing images:', error.message);
  }
}

testImages();
