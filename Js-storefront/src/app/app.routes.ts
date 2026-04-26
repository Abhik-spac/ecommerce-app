import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard, guestGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
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
    path: '',
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
  // Checkout MFE routes (accessible to both guests and authenticated users)
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule('checkoutMfe', './Routes').then(m => m.CHECKOUT_ROUTES)
  },
  // Order MFE routes
  // Order list is protected, but confirmation is accessible to guests
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule('orderMfe', './Routes').then(m => m.ORDER_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];

// Made with Bob - Microfrontend Architecture
