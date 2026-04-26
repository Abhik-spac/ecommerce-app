const jwt = require('jsonwebtoken');
const http = require('http');

// Generate a guest token
const guestId = 'test-guest-' + Date.now();
const token = jwt.sign(
  { guestId, type: 'guest' },
  'your-secret-key-change-in-production',
  { expiresIn: '7d' }
);

console.log('='.repeat(60));
console.log('Testing Wishlist Toggle API');
console.log('='.repeat(60));
console.log('Guest ID:', guestId);
console.log('Token:', token.substring(0, 50) + '...');
console.log('='.repeat(60));

const postData = JSON.stringify({ 
  productId: '507f1f77bcf86cd799439011' 
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/users/wishlist/toggle',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${token}`
  },
  timeout: 5000
};

console.log('\nSending POST request to:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Request body:', postData);
console.log('='.repeat(60));

const req = http.request(options, (res) => {
  console.log('\n✅ Response received!');
  console.log('Status Code:', res.statusCode);
  console.log('Status Message:', res.statusMessage);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('='.repeat(60));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
    console.log('='.repeat(60));
    console.log('✅ Test completed successfully!');
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error('\n❌ Request Error:', e.message);
  console.error('Error details:', e);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('\n❌ Request timed out after 5 seconds');
  req.destroy();
  process.exit(1);
});

req.write(postData);
req.end();

console.log('\n⏳ Waiting for response...\n');

// Made with Bob
