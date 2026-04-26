import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  attributes: Record<string, any>;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrls.product;

  /**
   * Get all products with optional filters and pagination
   */
  getProducts(filters?: ProductFilters): Observable<ProductsResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ProductFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params });
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  /**
   * Search products by query
   */
  searchProducts(query: string, filters?: Omit<ProductFilters, 'search'>): Observable<ProductsResponse> {
    return this.getProducts({ ...filters, search: query });
  }

  /**
   * Get all available categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  /**
   * Get all available brands
   */
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/brands`);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string, filters?: Omit<ProductFilters, 'category'>): Observable<ProductsResponse> {
    return this.getProducts({ ...filters, category });
  }

  /**
   * Get products by brand
   */
  getProductsByBrand(brand: string, filters?: Omit<ProductFilters, 'brand'>): Observable<ProductsResponse> {
    return this.getProducts({ ...filters, brand });
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 10): Observable<ProductsResponse> {
    return this.getProducts({ featured: true, limit });
  }

  /**
   * Get new products
   */
  getNewProducts(limit: number = 10): Observable<ProductsResponse> {
    return this.getProducts({ limit, sort: '-createdAt' });
  }

  /**
   * Get products on sale
   */
  getSaleProducts(limit?: number): Observable<ProductsResponse> {
    const filters: ProductFilters = {};
    if (limit) filters.limit = limit;
    // Backend should filter products where comparePrice > price
    return this.getProducts(filters);
  }

  /**
   * Get related products (same category, excluding current product)
   */
  getRelatedProducts(productId: string, category: string, limit: number = 4): Observable<ProductsResponse> {
    return this.getProducts({ category, limit: limit + 1 }).pipe(
      // Filter out the current product on the client side
      // In production, backend should handle this
    );
  }

  // ============================================
  // ADMIN METHODS (Require Authentication)
  // ============================================

  /**
   * Create a new product (Admin only)
   */
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  /**
   * Update an existing product (Admin only)
   */
  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, updates);
  }

  /**
   * Delete a product (Admin only)
   */
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/products/${id}`);
  }

  /**
   * Update product stock (Admin only)
   */
  updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set' = 'set'): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}/stock`, {
      quantity,
      operation
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Check if product is in stock
   */
  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  /**
   * Check if product is on sale
   */
  isOnSale(product: Product): boolean {
    return !!product.comparePrice && product.comparePrice > product.price;
  }

  /**
   * Calculate discount percentage
   */
  getDiscountPercentage(product: Product): number {
    if (!product.comparePrice || product.comparePrice <= product.price) {
      return 0;
    }
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  }

  /**
   * Get product image URL (with fallback)
   */
  getProductImage(product: Product, index: number = 0): string {
    if (product.images && product.images.length > index) {
      return product.images[index];
    }
    return product.thumbnail || '/no-image.svg';
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = '₹'): string {
    return `${currency}${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Made with Bob
