import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  // Product MFE routes
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './ProductRoutes'
      }).then(m => m.PRODUCT_ROUTES)
  },
  // Cart MFE routes
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './CartRoutes'
      }).then(m => m.CART_ROUTES)
  },
  // Auth MFE routes (accessible only to guests)
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        exposedModule: './AuthRoutes'
      }).then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        exposedModule: './AuthRoutes'
      }).then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'otp-login',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        exposedModule: './AuthRoutes'
      }).then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        exposedModule: './AuthRoutes'
      }).then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  // User MFE routes (protected)
  {
    path: 'profile',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4206/remoteEntry.js',
        exposedModule: './UserRoutes'
      }).then(m => m.USER_ROUTES),
    canActivate: [authGuard]
  },
  // Checkout MFE routes (protected)
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './CheckoutRoutes'
      }).then(m => m.CHECKOUT_ROUTES),
    canActivate: [authGuard]
  },
  // Order MFE routes (protected)
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4204/remoteEntry.js',
        exposedModule: './OrderRoutes'
      }).then(m => m.ORDER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];

// Made with Bob - Microfrontend Architecture
