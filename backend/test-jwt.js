const jwt = require('jsonwebtoken');

console.log('🔍 Testing JWT Token Generation...\n');

try {
  // Check if JWT_SECRET is set
  const jwtSecret = process.env.JWT_SECRET;
  console.log(`JWT_SECRET is set: ${jwtSecret ? 'Yes' : 'No'}`);
  
  if (!jwtSecret) {
    console.log('❌ JWT_SECRET is not set! This will cause server errors.');
    console.log('Please add JWT_SECRET to your .env file');
    return;
  }
  
  // Test token generation
  const testToken = jwt.sign({ userId: 'test123' }, jwtSecret, {
    expiresIn: '7d'
  });
  
  console.log('✅ JWT token generation works!');
  console.log(`Test token: ${testToken.substring(0, 20)}...`);
  
  // Test token verification
  const decoded = jwt.verify(testToken, jwtSecret);
  console.log('✅ JWT token verification works!');
  console.log(`Decoded userId: ${decoded.userId}`);
  
} catch (error) {
  console.error('❌ JWT Error:', error.message);
}
