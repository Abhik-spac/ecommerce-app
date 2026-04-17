# Quick Start Guide

Get the E-Commerce Microfrontend Platform running in minutes.

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+

## Installation

```bash
# Clone the repository (if applicable)
cd ecommerce-app

# Install dependencies
npm install
```

## Running the Application

### Option 1: Start All Microfrontends (Recommended)

```bash
npm run start:all-mfe-full
```

This command starts all 7 applications concurrently:
- Shell: http://localhost:4200
- Product MFE: http://localhost:4201
- Cart MFE: http://localhost:4202
- Checkout MFE: http://localhost:4203
- Order MFE: http://localhost:4204
- Auth MFE: http://localhost:4205
- User MFE: http://localhost:4206

**Wait for all servers to build** (approximately 30-60 seconds on first run).

### Option 2: Start Individual Applications

```bash
# Start shell app only
npm run start:shell

# Start specific MFEs
npm run start:product-mfe
npm run start:cart-mfe
npm run start:checkout-mfe
npm run start:order-mfe
npm run start:auth-mfe
npm run start:user-mfe
```

## Accessing the Application

1. Open your browser to http://localhost:4200
2. The shell app will dynamically load MFEs as you navigate

## Test Credentials

Use these credentials to test authentication:

- **Email Login**: test@example.com / password123
- **OTP Login**: Any phone number / OTP: 123456

## Test Payment Details

Use these test card details for checkout:

### Credit/Debit Card
- **Card Number**: `4111 1111 1111 1111` (Visa test card)
- **Cardholder Name**: Any name (e.g., `Test User`)
- **Expiry Date**: `12/25` (any future date in MM/YY format)
- **CVV**: `123` (any 3 digits)

### Alternative Test Cards
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`

### UPI Payment
- **UPI ID**: `test@upi` (any format like `name@bank`)

### Other Payment Methods
- **Net Banking**: Select and proceed (no additional details required)
- **Cash on Delivery**: Select and proceed (no additional details required)

> **Note**: This is a demo application with basic validation. The payment form checks for proper format but doesn't process real transactions.

## Available Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/products` | Product listing | No |
| `/products/:id` | Product details | No |
| `/cart` | Shopping cart | No |
| `/login` | Email/password login | Guest only |
| `/register` | User registration | Guest only |
| `/otp-login` | Phone OTP login | Guest only |
| `/forgot-password` | Password reset | Guest only |
| `/checkout` | Checkout process | Yes |
| `/orders` | Order history | Yes |
| `/profile` | User profile | Yes |

## Verifying the Setup

### Check All Servers Are Running

```bash
# Check listening ports
lsof -i :4200 -i :4201 -i :4202 -i :4203 -i :4204 -i :4205 -i :4206 | grep LISTEN
```

You should see 7 node processes listening on ports 4200-4206.

### Verify Remote Entry Points

```bash
# Check each MFE's remoteEntry.json
curl http://localhost:4201/remoteEntry.json  # Product MFE
curl http://localhost:4202/remoteEntry.json  # Cart MFE
curl http://localhost:4203/remoteEntry.json  # Checkout MFE
curl http://localhost:4204/remoteEntry.json  # Order MFE
curl http://localhost:4205/remoteEntry.json  # Auth MFE
curl http://localhost:4206/remoteEntry.json  # User MFE
```

Each should return a JSON response with federation configuration.

## Common Issues

### Port Already in Use

If you see "Port already in use" errors:

```bash
# Kill all ng serve processes
pkill -f "ng serve"

# Wait a few seconds, then restart
npm run start:all-mfe-full
```

### Build Errors

If you encounter build errors:

```bash
# Clear Angular cache
rm -rf .angular/cache dist

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart
npm run start:all-mfe-full
```

### MFE Not Loading

1. Check that all servers are running
2. Verify `public/federation.manifest.json` has correct URLs
3. Check browser console for errors
4. Ensure remoteEntry.json files are accessible

## Development Workflow

1. **Start all MFEs**: `npm run start:all-mfe-full`
2. **Make changes** to any MFE
3. **Hot reload** automatically rebuilds and refreshes
4. **Test** in browser at http://localhost:4200

## Next Steps

- Read [Architecture Overview](./ARCHITECTURE_OVERVIEW.md)
- Learn about [Module Federation](./MODULE_FEDERATION_COMPLETE_GUIDE.md)
- Check [Troubleshooting Guide](./TROUBLESHOOTING.md)

## Stopping the Application

Press `Ctrl+C` in the terminal where you ran the start command, or:

```bash
pkill -f "ng serve"
```

---

**Need help?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)