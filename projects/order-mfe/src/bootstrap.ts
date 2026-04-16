import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ORDER_ROUTES } from './lib/order.routes';

@Component({
  selector: 'order-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
export class OrderAppComponent {}

bootstrapApplication(OrderAppComponent, {
  providers: [
    provideRouter(ORDER_ROUTES)
  ]
}).catch(err => console.error(err));

// Made with Bob
