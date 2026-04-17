import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

export const ORDER_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent
  },
  {
    path: ':id',
    component: OrderConfirmationComponent
  }
];
