# 🚀 Quick Start Guide - Angular eCommerce Platform

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 19.x or higher

```bash
node --version  # Should be 18+
npm --version   # Should be 9+
ng version      # Should be 19+
```

---

## Installation

### 1. Install Dependencies
```bash
cd ecommerce-app
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at: **http://localhost:4200**

---

## 🎓 Test Credentials

### Login with Email/Password
- **Email**: `test@example.com`
- **Password**: `password123`

### Login with OTP
- **Mobile**: `9876543210`
- **OTP**: `123456`

### Social Login
- Click "Login with Google" (mock implementation)

---

## 🧭 Navigation Guide

### Public Pages (No Login Required)
1. **Home/Products** (`/products`)
   - Browse all products
   - Search, filter, sort
   - Add to cart

2. **Product Details** (`/products/:id`)
   - View product information
   - Select quantity
   - Add to cart

3. **Shopping Cart** (`/cart`)
   - View cart items
   - Update quantities
   - See price breakdown

4. **Login** (`/login`)
   - Email/password login
   - Link to OTP login
   - Link to registration

5. **Register** (`/register`)
   - Create new account
   - Email verification

6. **OTP Login** (`/otp-login`)
   - Login with mobile OTP

7. **Forgot Password** (`/forgot-password`)
   - Reset password via email/OTP

### Protected Pages (Login Required)
1. **Checkout** (`/checkout`)
   - 3-step checkout process
   - Shipping, payment, review

2. **Orders** (`/orders`)
   - View order history
   - Track orders
   - Cancel orders
   - Download invoices

3. **Profile** (`/profile`)
   - Update personal info
   - Change password
   - Manage addresses
   - Account settings

---

## 🛍️ Complete Shopping Flow

### Step 1: Browse Products
1. Go to **Products** page
2. Use search bar to find products
3. Apply filters (category, price range)
4. Sort by price/name/rating

### Step 2: View Product Details
1. Click on any product card
2. View full product information
3. Select quantity
4. Click "Add to Cart"

### Step 3: Review Cart
1. Click cart icon in toolbar (shows item count)
2. Review items in cart
3. Update quantities with +/- buttons
4. Remove items if needed
5. See subtotal, tax, and total

### Step 4: Checkout (Requires Login)
1. Click "Proceed to Checkout"
2. If not logged in, redirected to login
3. **Step 1**: Enter shipping information
4. **Step 2**: Select payment method
5. **Step 3**: Review order and place

### Step 5: Order Confirmation
1. Order placed successfully
2. View order details
3. Get order ID

### Step 6: Track Orders
1. Go to **Orders** page
2. View all orders
3. Filter by status (All/Pending/Delivered)
4. Cancel orders if needed
5. Download invoices

---

## 🔧 Development Commands

### Start Development Server
```bash
npm start
# or
ng serve
```

### Build for Production
```bash
npm run build
# or
ng build
```

### Run Tests
```bash
npm test
# or
ng test
```

### Lint Code
```bash
npm run lint
# or
ng lint
```

### Format Code
```bash
npm run format
```

---

## 🏗️ Module Federation (Microfrontends)

### Start All Apps
```bash
npm run start:all
```

This starts:
- **B2C App**: http://localhost:4200
- **B2B App**: http://localhost:4201
- **Admin App**: http://localhost:4202

### Start Individual Apps
```bash
# B2C Storefront
npm run start:b2c

# B2B Storefront
npm run start:b2b

# Admin Panel
npm run start:admin
```

---

## 📁 Project Structure

```
ecommerce-app/
├── src/
│   ├── app/
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── product/       # Product catalog
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── checkout/      # Checkout flow
│   │   │   ├── order/         # Order management
│   │   │   └── user/          # User profile
│   │   ├── services/          # Shared services
│   │   ├── guards/            # Route guards
│   │   ├── interceptors/      # HTTP interceptors
│   │   ├── models/            # TypeScript interfaces
│   │   ├── app.component.ts   # Root component
│   │   └── app.routes.ts      # Route configuration
│   ├── assets/                # Static assets
│   └── styles.scss            # Global styles
├── b2b-app/                   # B2B application
├── admin-app/                 # Admin application
└── package.json
```

---

## 🎨 UI Components

### Material Design Components Used
- **Toolbar**: Navigation bar
- **Card**: Product cards, order cards
- **Button**: Primary, accent, warn buttons
- **Icon**: Material icons throughout
- **Badge**: Cart item count
- **Menu**: User dropdown menu
- **Stepper**: Checkout flow, password reset
- **Tabs**: Profile sections, order filters
- **Form Field**: Input fields
- **Select**: Dropdowns
- **Checkbox**: Checkboxes
- **Radio**: Radio buttons
- **Divider**: Section separators
- **Snackbar**: Toast notifications
- **Dialog**: Modals (future)
- **Progress**: Loading indicators

---

## 🔐 Authentication Flow

### Email/Password Login
1. Enter email and password
2. Click "Sign In"
3. JWT token stored in localStorage
4. Redirected to products page

### OTP Login
1. Enter mobile number
2. Click "Send OTP"
3. Enter 6-digit OTP (123456)
4. Click "Verify OTP"
5. Logged in successfully

### Registration
1. Fill registration form
2. Accept terms and conditions
3. Click "Sign Up"
4. Auto-login after registration

### Forgot Password
1. Enter email
2. Verify OTP
3. Set new password
4. Redirected to login

---

## 💾 Data Persistence

### localStorage Keys
- `auth_token`: JWT token
- `current_user`: User object
- `cart_items`: Shopping cart
- `orders`: Order history
- `products`: Product catalog

### Mock Data
All data is stored in localStorage for demo purposes. In production, replace with real API calls.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9

# Or use different port
ng serve --port 4201
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
rm -rf .angular
ng build
```

### TypeScript Errors
```bash
# Check TypeScript version
npm list typescript

# Update if needed
npm install typescript@latest
```

---

## 📚 Additional Resources

### Documentation
- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)

### Architecture Docs
- `ARCHITECTURE.md` - System architecture
- `MODULE_FEDERATION.md` - Microfrontend setup
- `IMPLEMENTATION_SUMMARY.md` - What's implemented
- `FEATURES_IMPLEMENTED.txt` - Feature checklist

---

## 🎯 Next Steps

### For Development
1. Replace mock data with real API calls
2. Integrate payment gateway (Stripe/Razorpay)
3. Add real-time notifications
4. Implement email/SMS notifications
5. Add analytics tracking

### For B2B Features
1. Implement bulk ordering
2. Add quote request (RFQ)
3. Custom pricing per company
4. Multi-user company accounts
5. Purchase order management

### For Admin Panel
1. User management CRUD
2. Product management CRUD
3. Order management
4. Inventory tracking
5. Analytics dashboard
6. CMS for content

---

## 💡 Tips

### Development
- Use Angular DevTools browser extension
- Enable source maps for debugging
- Use Angular CLI schematics for generating code
- Follow Angular style guide

### Performance
- Lazy load all feature modules
- Use OnPush change detection
- Optimize images
- Enable production mode for builds
- Use trackBy in *ngFor

### Security
- Never commit sensitive data
- Use environment variables
- Implement CSRF protection
- Sanitize user inputs
- Use HTTPS in production

---

## 🤝 Support

For issues or questions:
1. Check documentation files
2. Review code comments
3. Check Angular documentation
4. Search Stack Overflow

---

**Happy Coding! 🚀**