import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { authGuard } from '../../../../src/app/guards/auth.guard';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [authGuard] // Protect order list - requires authentication
  },
  {
    path: 'track',
    component: TrackOrderComponent
    // No guard - accessible to everyone (especially guests)
  },
  {
    path: ':id',
    component: OrderConfirmationComponent
    // No guard - accessible to both guests and authenticated users
  }
];
