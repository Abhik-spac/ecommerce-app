import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PRODUCT_ROUTES } from './lib/product.routes';

@Component({
  selector: 'product-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="product-mfe-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .product-mfe-container {
      padding: 20px;
    }
  `]
})
export class ProductAppComponent {}

bootstrapApplication(ProductAppComponent, {
  providers: [
    provideRouter(PRODUCT_ROUTES),
    provideAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

// Made with Bob
