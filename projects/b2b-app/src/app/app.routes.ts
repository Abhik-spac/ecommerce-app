import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  // B2B uses same MFEs as B2C but can have different business logic
  {
    path: 'products',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './ProductRoutes'
      }).then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './CartRoutes'
      }).then(m => m.CART_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './CheckoutRoutes'
      }).then(m => m.CHECKOUT_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4204/remoteEntry.js',
        exposedModule: './OrderRoutes'
      }).then(m => m.ORDER_ROUTES)
  },
  {
    path: 'auth',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4205/remoteEntry.js',
        exposedModule: './AuthRoutes'
      }).then(m => m.AUTH_ROUTES)
  },
  {
    path: 'profile',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4206/remoteEntry.js',
        exposedModule: './UserRoutes'
      }).then(m => m.USER_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
