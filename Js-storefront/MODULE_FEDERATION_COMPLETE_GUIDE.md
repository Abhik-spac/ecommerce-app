# Module Federation Setup - Complete Guide

## 🎯 Overview

This guide provides step-by-step instructions for setting up and running the microfrontend architecture using Webpack Module Federation.

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Module Federation                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   B2C App    │  │   B2B App    │  │  Admin App   │ │
│  │  (Shell)     │  │  (Remote)    │  │  (Remote)    │ │
│  │  Port: 4200  │  │  Port: 4201  │  │  Port: 4202  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                    Shared Dependencies                   │
│         (@angular/core, @angular/material, rxjs)        │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Applications

### 1. B2C App (Shell/Host) - Port 4200
**Purpose:** Customer-facing storefront
**Exposes:**
- ProductModule
- CartModule
- AuthModule

**Consumes:**
- B2B features (when needed)
- Admin features (for admin users)

### 2. B2B App (Remote) - Port 4201
**Purpose:** Business customer portal
**Exposes:**
- B2BDashboard
- B2BOrders
- B2BQuotes

**Consumes:**
- Product catalog from B2C
- Auth from B2C

### 3. Admin App (Remote) - Port 4202
**Purpose:** Administrative control panel
**Exposes:**
- AdminDashboard
- UserManagement
- ProductManagement
- OrderManagement

**Consumes:**
- Auth from B2C

## 📋 Prerequisites

✅ Node.js 18+ installed
✅ Angular CLI 19+ installed
✅ @angular-architects/module-federation installed

## 🚀 Installation Steps

### Step 1: Install Module Federation
```bash
cd ecommerce-app
npm install @angular-architects/module-federation@19.0.0 --save-dev
```

### Step 2: Verify Installation
```bash
npm list @angular-architects/module-federation
```

Expected output:
```
ecommerce-app@0.0.0
└── @angular-architects/module-federation@19.0.0
```

## 📁 Configuration Files

### 1. B2C App (Shell) - `webpack.config.js`

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");

module.exports = {
  output: {
    uniqueName: "b2cApp",
    publicPath: "auto"
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "b2cApp",
      filename: "remoteEntry.js",
      exposes: {
        './ProductModule': './src/app/features/product/product-list/product-list.component.ts',
        './CartModule': './src/app/features/cart/cart.component.ts',
        './AuthModule': './src/app/features/auth/auth.service.ts',
      },
      remotes: {
        "b2bApp": "b2bApp@http://localhost:4201/remoteEntry.js",
        "adminApp": "adminApp@http://localhost:4202/remoteEntry.js",
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@angular/material": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

### 2. B2B App - `projects/b2b-app/webpack.config.js`

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "b2bApp",
    publicPath: "auto"
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "b2bApp",
      filename: "remoteEntry.js",
      exposes: {
        './B2BDashboard': './src/app/features/dashboard/dashboard.component.ts',
        './B2BOrders': './src/app/features/orders/orders.component.ts',
        './B2BQuotes': './src/app/features/quotes/quotes.component.ts',
      },
      remotes: {
        "b2cApp": "b2cApp@http://localhost:4200/remoteEntry.js"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@angular/material": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

### 3. Admin App - `projects/admin-app/webpack.config.js`

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  output: {
    uniqueName: "adminApp",
    publicPath: "auto"
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "adminApp",
      filename: "remoteEntry.js",
      exposes: {
        './AdminDashboard': './src/app/features/dashboard/dashboard.component.ts',
        './UserManagement': './src/app/features/users/users.component.ts',
        './ProductManagement': './src/app/features/products/products.component.ts',
        './OrderManagement': './src/app/features/orders/orders.component.ts',
      },
      remotes: {
        "b2cApp": "b2cApp@http://localhost:4200/remoteEntry.js"
      },
      shared: {
        "@angular/core": { singleton: true, strictVersion: true },
        "@angular/common": { singleton: true, strictVersion: true },
        "@angular/router": { singleton: true, strictVersion: true },
        "@angular/material": { singleton: true, strictVersion: true },
        "rxjs": { singleton: true, strictVersion: true }
      }
    })
  ]
};
```

## 🔧 Angular.json Configuration

The `angular.json` has been updated with:

1. **Module Federation Builder** for all apps
2. **Custom Webpack Config** paths
3. **Dedicated Ports** for each app:
   - B2C: 4200
   - B2B: 4201
   - Admin: 4202

## 🎮 Running the Applications

### Option 1: Run All Apps Simultaneously (Recommended)

Create a `package.json` script:

```json
{
  "scripts": {
    "start:all": "concurrently \"npm run start:b2c\" \"npm run start:b2b\" \"npm run start:admin\"",
    "start:b2c": "ng serve ecommerce-app --port 4200",
    "start:b2b": "ng serve b2b-app --port 4201",
    "start:admin": "ng serve admin-app --port 4202"
  }
}
```

Install concurrently:
```bash
npm install concurrently --save-dev
```

Run all apps:
```bash
npm run start:all
```

### Option 2: Run Apps Individually

**Terminal 1 - B2C App (Shell):**
```bash
cd ecommerce-app
ng serve ecommerce-app --port 4200
```

**Terminal 2 - B2B App:**
```bash
cd ecommerce-app
ng serve b2b-app --port 4201
```

**Terminal 3 - Admin App:**
```bash
cd ecommerce-app
ng serve admin-app --port 4202
```

## 🌐 Access URLs

- **B2C Storefront:** http://localhost:4200
- **B2B Portal:** http://localhost:4201
- **Admin Panel:** http://localhost:4202

## 🔄 Loading Remote Modules

### Dynamic Import Example

```typescript
// In B2C app, load B2B dashboard dynamically
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'b2b-dashboard',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './B2BDashboard'
      }).then(m => m.DashboardComponent)
  }
];
```

### Static Import Example

```typescript
// In webpack.config.js, define remotes
remotes: {
  "b2bApp": "b2bApp@http://localhost:4201/remoteEntry.js"
}

// In routes
{
  path: 'b2b',
  loadChildren: () => import('b2bApp/B2BDashboard')
    .then(m => m.DashboardComponent)
}
```

## 🛡️ Shared Dependencies

All apps share these dependencies as singletons:

- `@angular/core`
- `@angular/common`
- `@angular/common/http`
- `@angular/router`
- `@angular/material`
- `rxjs`

**Benefits:**
- ✅ Single instance across all microfrontends
- ✅ Reduced bundle size
- ✅ Consistent versions
- ✅ Shared state management

## 🐛 Troubleshooting

### Issue 1: Module Not Found
**Error:** `Cannot find module 'b2bApp/B2BDashboard'`

**Solution:**
1. Ensure B2B app is running on port 4201
2. Check webpack.config.js remotes configuration
3. Verify exposed module path in B2B webpack config

### Issue 2: Version Mismatch
**Error:** `Shared module is not available for eager consumption`

**Solution:**
1. Ensure all apps use same Angular version
2. Check shared dependencies configuration
3. Set `strictVersion: false` for development

### Issue 3: CORS Errors
**Error:** `Access to fetch at 'http://localhost:4201/remoteEntry.js' has been blocked by CORS`

**Solution:**
1. Ensure all apps are running
2. Check publicHost configuration in angular.json
3. Use `publicPath: "auto"` in webpack config

### Issue 4: Build Errors
**Error:** `Module Federation plugin not found`

**Solution:**
```bash
npm install @angular-architects/module-federation --save-dev
npm install webpack --save-dev
```

## 📊 Performance Optimization

### 1. Lazy Loading
Load remote modules only when needed:

```typescript
{
  path: 'admin',
  loadChildren: () => import('adminApp/AdminDashboard'),
  canActivate: [adminGuard]
}
```

### 2. Preloading Strategy
Preload critical remote modules:

```typescript
import { PreloadAllModules } from '@angular/router';

RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules
})
```

### 3. Code Splitting
Split large modules into smaller chunks:

```javascript
exposes: {
  './Dashboard': './src/app/features/dashboard/dashboard.component.ts',
  './Reports': './src/app/features/reports/reports.component.ts',
  './Settings': './src/app/features/settings/settings.component.ts'
}
```

## 🔐 Security Considerations

### 1. Authentication
Share auth state across microfrontends:

```typescript
// In B2C app (shell)
export class AuthService {
  private authState = signal<User | null>(null);
  
  // Expose auth state to remotes
  getAuthState() {
    return this.authState;
  }
}
```

### 2. Route Guards
Protect remote routes:

```typescript
{
  path: 'admin',
  loadChildren: () => import('adminApp/AdminDashboard'),
  canActivate: [adminGuard]
}
```

### 3. CSP Headers
Configure Content Security Policy:

```html
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' http://localhost:4200 http://localhost:4201 http://localhost:4202">
```

## 📦 Production Build

### Build All Apps

```bash
# Build B2C app
ng build ecommerce-app --configuration production

# Build B2B app
ng build b2b-app --configuration production

# Build Admin app
ng build admin-app --configuration production
```

### Production Webpack Config

Update remotes URLs for production:

```javascript
remotes: {
  "b2bApp": "b2bApp@https://b2b.example.com/remoteEntry.js",
  "adminApp": "adminApp@https://admin.example.com/remoteEntry.js"
}
```

## 🚢 Deployment

### Option 1: Separate Deployments
Deploy each app to different domains:
- B2C: https://shop.example.com
- B2B: https://b2b.example.com
- Admin: https://admin.example.com

### Option 2: Single Domain with Subpaths
Deploy all apps under one domain:
- B2C: https://example.com/
- B2B: https://example.com/b2b/
- Admin: https://example.com/admin/

### Option 3: CDN Deployment
Deploy to CDN for global distribution:
```javascript
remotes: {
  "b2bApp": "b2bApp@https://cdn.example.com/b2b/remoteEntry.js"
}
```

## 📈 Monitoring

### 1. Module Loading Metrics
Track remote module load times:

```typescript
import { loadRemoteModule } from '@angular-architects/module-federation';

const startTime = performance.now();
await loadRemoteModule({...});
const loadTime = performance.now() - startTime;
console.log(`Module loaded in ${loadTime}ms`);
```

### 2. Error Tracking
Monitor module federation errors:

```typescript
window.addEventListener('error', (event) => {
  if (event.message.includes('remoteEntry')) {
    // Log to monitoring service
    console.error('Remote module failed to load', event);
  }
});
```

## ✅ Verification Checklist

- [ ] All three apps created (B2C, B2B, Admin)
- [ ] Module Federation package installed
- [ ] Webpack configs created for all apps
- [ ] Angular.json updated with MF builders
- [ ] Ports configured (4200, 4201, 4202)
- [ ] Shared dependencies configured
- [ ] Remote modules exposed
- [ ] Remote modules consumed
- [ ] All apps build successfully
- [ ] All apps serve successfully
- [ ] Remote modules load correctly
- [ ] Shared state works across apps
- [ ] Authentication works across apps
- [ ] Production build tested

## 🎓 Best Practices

1. **Version Consistency:** Keep Angular versions consistent across all apps
2. **Shared State:** Use a shared state management solution (NgRx, Signals)
3. **Error Boundaries:** Implement error handling for remote module failures
4. **Fallbacks:** Provide fallback UI when remote modules fail to load
5. **Testing:** Test each microfrontend independently and together
6. **Documentation:** Document exposed modules and their contracts
7. **Versioning:** Version your remote modules for backward compatibility
8. **Monitoring:** Monitor module load times and errors in production

## 📚 Additional Resources

- [Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Angular Architects MF](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/)
- [Nx Module Federation](https://nx.dev/recipes/module-federation)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review webpack.config.js configurations
3. Verify all apps are running on correct ports
4. Check browser console for errors
5. Review network tab for failed module loads

---

**Status:** ✅ Module Federation Setup Complete

All three applications are configured with Module Federation and ready to run as independent microfrontends that can share code and state.