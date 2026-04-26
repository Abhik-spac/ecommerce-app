(function(window) {
  window.__env = window.__env || {};
  
  // Environment variables - All requests go through API Gateway (port 3000)
  // Base URLs only - services will append their specific paths
  window.__env.AUTH_SERVICE_URL = 'http://localhost:3000/api/v1';
  window.__env.PRODUCT_SERVICE_URL = 'http://localhost:3000/api/v1';
  window.__env.CART_SERVICE_URL = 'http://localhost:3000/api/v1';
  window.__env.CHECKOUT_SERVICE_URL = 'http://localhost:3000/api/v1';
  window.__env.ORDER_SERVICE_URL = 'http://localhost:3000/api/v1';
  window.__env.USER_SERVICE_URL = 'http://localhost:3000/api/v1/users';
}(this));
