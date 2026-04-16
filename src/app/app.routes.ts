import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
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
      loadRemoteModule('productMfe', './Routes').then(m => m.PRODUCT_ROUTES)
  },
  // Cart MFE routes
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule('cartMfe', './Routes').then(m => m.CART_ROUTES)
  },
  // Auth MFE routes (accessible only to guests)
  {
    path: 'login',
    loadChildren: () =>
      loadRemoteModule('authMfe', './Routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadChildren: () =>
      loadRemoteModule('authMfe', './Routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'otp-login',
    loadChildren: () =>
      loadRemoteModule('authMfe', './Routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      loadRemoteModule('authMfe', './Routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  // User MFE routes (protected)
  {
    path: 'profile',
    loadChildren: () =>
      loadRemoteModule('userMfe', './Routes').then(m => m.USER_ROUTES),
    canActivate: [authGuard]
  },
  // Checkout MFE routes (protected)
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule('checkoutMfe', './Routes').then(m => m.CHECKOUT_ROUTES),
    canActivate: [authGuard]
  },
  // Order MFE routes (protected)
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('orderMfe', './Routes').then(m => m.ORDER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];

// Made with Bob - Microfrontend Architecture
