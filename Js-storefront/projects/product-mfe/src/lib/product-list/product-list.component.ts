import { Component, OnInit, signal, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../product.service';
import { CartService, WishlistService, AuthService } from '@ecommerce/shared';
import { Subscription } from 'rxjs';

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
    MatBadgeModule,
    MatSliderModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  products = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  searchQuery = '';
  sortBy = 'name';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  hasMore = true;
  
  // Filter states
  selectedTags: string[] = [];
  minPrice = 0;
  maxPrice = 500000;
  priceRange = [0, 500000];
  minRating = 0;
  
  // Mobile filter toggle
  showFilters = false;
  
  // Available filter options (based on actual product tags)
  availableTags = ['laptop', 'phone', 'audio', 'wearable', 'tablet', 'camera', 'featured', 'new'];
  
  @ViewChild('loadMoreTrigger') loadMoreTrigger?: ElementRef;
  private observer?: IntersectionObserver;
  private subscriptions = new Subscription();
  
  constructor(
    private productService: ProductService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Subscribe to query params to handle search from global header
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        if (params['search']) {
          this.searchQuery = params['search'];
        }
        this.loadProducts();
      })
    );
  }

  ngAfterViewInit(): void {
    // Set up Intersection Observer for infinite scroll
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.hasMore && !this.isLoadingMore()) {
          this.loadMoreProducts();
        }
      });
    }, options);

    // Observe the trigger element if it exists
    if (this.loadMoreTrigger) {
      this.observer.observe(this.loadMoreTrigger.nativeElement);
    }
  }

  loadProducts(reset: boolean = true): void {
    if (reset) {
      this.isLoading.set(true);
      this.currentPage = 1;
      this.products.set([]);
    } else {
      this.isLoadingMore.set(true);
    }
    
    const params: any = {
      page: this.currentPage,
      limit: 15
    };
    
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }
    
    if (this.sortBy) {
      params.sortBy = this.sortBy;
      params.sortOrder = 'asc';
    }
    
    this.productService.getProducts(params).subscribe({
      next: (response) => {
        const newProducts = reset ? response.products : [...this.products(), ...response.products];
        this.products.set(newProducts);
        this.totalPages = response.pagination.pages;
        this.hasMore = this.currentPage < response.pagination.pages;
        this.applyFilters();
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      }
    });
  }

  loadMoreProducts(): void {
    if (!this.hasMore || this.isLoadingMore()) {
      return;
    }
    this.currentPage++;
    this.loadProducts(false);
  }

  applyFilters(): void {
    let filtered = [...this.products()];
    
    // If there's a search query, show search results without additional filtering
    // This prevents filters from hiding search results
    if (this.searchQuery) {
      this.filteredProducts.set(filtered);
      return;
    }
    
    // Filter by tags
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(p => {
        const productTags = (p.tags || []).map((t: string) => t.toLowerCase());
        return this.selectedTags.some(tag =>
          productTags.includes(tag.toLowerCase())
        );
      });
    }
    
    // Filter by price range
    filtered = filtered.filter(p =>
      p.price >= this.priceRange[0] && p.price <= this.priceRange[1]
    );
    
    // Filter by rating
    if (this.minRating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= this.minRating);
    }
    
    this.filteredProducts.set(filtered);
  }

  onSortChange(): void {
    this.loadProducts();
  }

  onTagChange(tag: string, checked: boolean): void {
    if (checked) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }

  onRatingChange(rating: number): void {
    this.minRating = rating;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedTags = [];
    this.priceRange = [0, 500000];
    this.minRating = 0;
    this.searchQuery = '';
    this.loadProducts();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.selectedTags.length > 0) count++;
    if (this.priceRange[0] > 0 || this.priceRange[1] < 100000) count++;
    if (this.minRating > 0) count++;
    return count;
  }

  getSortLabel(): string {
    const labels: { [key: string]: string } = {
      'name': 'Name',
      'price': 'Price',
      'rating': 'Rating',
      'createdAt': 'Newest'
    };
    return labels[this.sortBy] || 'Sort';
  }

  addToCart(product: any, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  toggleWishlist(product: any, event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggleWishlist(product._id, product.name);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  getDiscountPercentage(product: any): number {
    if (!product.compareAtPrice) return 0;
    return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
  }
}

// Made with Bob
