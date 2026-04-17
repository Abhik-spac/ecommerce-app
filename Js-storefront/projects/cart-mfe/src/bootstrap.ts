import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CART_ROUTES } from './lib/cart.routes';

@Component({
  selector: 'cart-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="cart-mfe-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .cart-mfe-container {
      padding: 20px;
    }
  `]
})
export class CartAppComponent {}

bootstrapApplication(CartAppComponent, {
  providers: [
    provideRouter(CART_ROUTES),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

// Made with Bob
