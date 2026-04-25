export const environment = {
  production: true,
  apiUrls: {
    auth: getEnvVar('AUTH_SERVICE_URL'),
    product: getEnvVar('PRODUCT_SERVICE_URL'),
    cart: getEnvVar('CART_SERVICE_URL'),
    checkout: getEnvVar('CHECKOUT_SERVICE_URL'),
    order: getEnvVar('ORDER_SERVICE_URL'),
    user: getEnvVar('USER_SERVICE_URL')
  }
};

function getEnvVar(key: string): string {
  const value = (window as any).__env?.[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

// Made with Bob
