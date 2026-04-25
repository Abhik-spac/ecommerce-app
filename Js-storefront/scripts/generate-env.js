const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

// Generate env.js content
const envJs = `(function(window) {
  window.__env = window.__env || {};
  
  // Environment variables
  window.__env.AUTH_SERVICE_URL = '${envVars.AUTH_SERVICE_URL || ''}';
  window.__env.PRODUCT_SERVICE_URL = '${envVars.PRODUCT_SERVICE_URL || ''}';
  window.__env.CART_SERVICE_URL = '${envVars.CART_SERVICE_URL || ''}';
  window.__env.CHECKOUT_SERVICE_URL = '${envVars.CHECKOUT_SERVICE_URL || ''}';
  window.__env.ORDER_SERVICE_URL = '${envVars.ORDER_SERVICE_URL || ''}';
  window.__env.USER_SERVICE_URL = '${envVars.USER_SERVICE_URL || ''}';
}(this));
`;

// Write to public/env.js
const outputPath = path.join(__dirname, '../public/env.js');
fs.writeFileSync(outputPath, envJs);

console.log('✅ Generated public/env.js from .env.local');

// Made with Bob
