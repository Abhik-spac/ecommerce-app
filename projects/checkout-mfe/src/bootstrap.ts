import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CHECKOUT_ROUTES } from './lib/checkout.routes';

@Component({
  selector: 'checkout-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="checkout-mfe-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .checkout-mfe-container {
      padding: 20px;
    }
  `]
})
export class CheckoutAppComponent {}

bootstrapApplication(CheckoutAppComponent, {
  providers: [
    provideRouter(CHECKOUT_ROUTES),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

// Made with Bob
