import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductService } from '../product.service';
import { CartService } from '@ecommerce/shared';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products = signal<any[]>([]);
  isLoading = signal(true);
  searchQuery = '';
  sortBy = 'name';
  
  constructor(
    private productService: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const params: any = {};
    
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    
    if (this.sortBy) {
      params.sortBy = this.sortBy;
      params.sortOrder = 'asc';
    }
    
    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.products.set(response.products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.loadProducts();
  }

  onSortChange(): void {
    this.loadProducts();
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  getDiscountPercentage(product: any): number {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }
}

// Made with Bob
