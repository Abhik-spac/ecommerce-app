import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  private products = [
    {
      id: '1',
      sku: 'LAPTOP-001',
      name: 'Premium Laptop Pro 15',
      slug: 'premium-laptop-pro-15',
      description: 'High-performance laptop with 16GB RAM, 512GB SSD, and Intel i7 processor',
      shortDescription: 'Professional laptop for work and gaming',
      categoryId: 'electronics',
      price: 89999,
      compareAtPrice: 99999,
      status: 'ACTIVE',
      images: [
        { id: '1', url: 'https://via.placeholder.com/400x400?text=Laptop', alt: 'Laptop', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'RAM', value: '16GB', displayOrder: 1 },
        { name: 'Storage', value: '512GB SSD', displayOrder: 2 },
        { name: 'Processor', value: 'Intel i7', displayOrder: 3 }
      ],
      inventory: { quantity: 50, lowStockThreshold: 10, trackInventory: true, allowBackorder: false, sku: 'LAPTOP-001' },
      tags: ['electronics', 'laptop', 'featured'],
      isFeatured: true,
      isNew: true,
      rating: 4.5,
      reviewCount: 128,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      sku: 'PHONE-001',
      name: 'Smartphone X Pro',
      slug: 'smartphone-x-pro',
      description: '6.5" AMOLED display, 128GB storage, 48MP camera',
      shortDescription: 'Latest flagship smartphone',
      categoryId: 'electronics',
      price: 54999,
      compareAtPrice: 64999,
      status: 'ACTIVE',
      images: [
        { id: '2', url: 'https://via.placeholder.com/400x400?text=Phone', alt: 'Phone', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'Display', value: '6.5" AMOLED', displayOrder: 1 },
        { name: 'Storage', value: '128GB', displayOrder: 2 },
        { name: 'Camera', value: '48MP', displayOrder: 3 }
      ],
      inventory: { quantity: 100, lowStockThreshold: 20, trackInventory: true, allowBackorder: false, sku: 'PHONE-001' },
      tags: ['electronics', 'phone', 'featured'],
      isFeatured: true,
      isNew: false,
      rating: 4.7,
      reviewCount: 256,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      sku: 'HEADPHONE-001',
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
      shortDescription: 'Premium wireless headphones',
      categoryId: 'electronics',
      price: 12999,
      compareAtPrice: 15999,
      status: 'ACTIVE',
      images: [
        { id: '3', url: 'https://via.placeholder.com/400x400?text=Headphones', alt: 'Headphones', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'Battery Life', value: '30 hours', displayOrder: 1 },
        { name: 'Connectivity', value: 'Bluetooth 5.0', displayOrder: 2 }
      ],
      inventory: { quantity: 75, lowStockThreshold: 15, trackInventory: true, allowBackorder: false, sku: 'HEADPHONE-001' },
      tags: ['electronics', 'audio', 'featured'],
      isFeatured: true,
      isNew: false,
      rating: 4.3,
      reviewCount: 89,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      sku: 'WATCH-001',
      name: 'Smart Watch Ultra',
      slug: 'smart-watch-ultra',
      description: 'Advanced fitness tracking, heart rate monitor, GPS, water resistant',
      shortDescription: 'Premium smartwatch',
      categoryId: 'electronics',
      price: 24999,
      compareAtPrice: 29999,
      status: 'ACTIVE',
      images: [
        { id: '4', url: 'https://via.placeholder.com/400x400?text=Watch', alt: 'Watch', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'Display', value: '1.9" AMOLED', displayOrder: 1 },
        { name: 'Battery', value: '7 days', displayOrder: 2 }
      ],
      inventory: { quantity: 60, lowStockThreshold: 10, trackInventory: true, allowBackorder: false, sku: 'WATCH-001' },
      tags: ['electronics', 'wearable', 'new'],
      isFeatured: false,
      isNew: true,
      rating: 4.6,
      reviewCount: 145,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      sku: 'TABLET-001',
      name: 'Tablet Pro 11',
      slug: 'tablet-pro-11',
      description: '11" display, 256GB storage, stylus support, perfect for creativity',
      shortDescription: 'Professional tablet',
      categoryId: 'electronics',
      price: 45999,
      status: 'ACTIVE',
      images: [
        { id: '5', url: 'https://via.placeholder.com/400x400?text=Tablet', alt: 'Tablet', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'Display', value: '11" LCD', displayOrder: 1 },
        { name: 'Storage', value: '256GB', displayOrder: 2 }
      ],
      inventory: { quantity: 40, lowStockThreshold: 10, trackInventory: true, allowBackorder: false, sku: 'TABLET-001' },
      tags: ['electronics', 'tablet'],
      isFeatured: false,
      isNew: false,
      rating: 4.4,
      reviewCount: 67,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      sku: 'CAMERA-001',
      name: 'Digital Camera 4K',
      slug: 'digital-camera-4k',
      description: '24MP sensor, 4K video recording, WiFi connectivity',
      shortDescription: 'Professional 4K camera',
      categoryId: 'electronics',
      price: 67999,
      compareAtPrice: 74999,
      status: 'ACTIVE',
      images: [
        { id: '6', url: 'https://via.placeholder.com/400x400?text=Camera', alt: 'Camera', position: 1, isDefault: true }
      ],
      variants: [],
      attributes: [
        { name: 'Sensor', value: '24MP', displayOrder: 1 },
        { name: 'Video', value: '4K 60fps', displayOrder: 2 }
      ],
      inventory: { quantity: 25, lowStockThreshold: 5, trackInventory: true, allowBackorder: false, sku: 'CAMERA-001' },
      tags: ['electronics', 'camera', 'featured'],
      isFeatured: true,
      isNew: true,
      rating: 4.8,
      reviewCount: 92,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private users = [
    {
      id: '1',
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    },
    {
      id: '2',
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+91 9876543211',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date()
    }
  ];

  getProducts(params?: any): Observable<any> {
    let filteredProducts = [...this.products];
    
    // Apply search filter
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search)
      );
    }
    
    // Apply price filter
    if (params?.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice);
    }
    if (params?.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice);
    }
    
    // Apply sorting
    if (params?.sortBy) {
      filteredProducts.sort((a, b) => {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        if (params.sortBy === 'price') {
          return (a.price - b.price) * order;
        } else if (params.sortBy === 'name') {
          return a.name.localeCompare(b.name) * order;
        } else if (params.sortBy === 'rating') {
          return (a.rating - b.rating) * order;
        }
        return 0;
      });
    }
    
    const page = params?.page || 1;
    const limit = params?.limit || 24;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return of({
      products: filteredProducts.slice(start, end),
      total: filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredProducts.length / limit),
      filters: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 100000 },
        attributes: []
      }
    }).pipe(delay(500));
  }

  getProductById(id: string): Observable<any> {
    const product = this.products.find(p => p.id === id || p.slug === id);
    return of(product).pipe(delay(300));
  }

  login(email: string, password: string): Observable<any> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return of({
        user: userWithoutPassword,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }).pipe(delay(500));
    }
    throw new Error('Invalid credentials');
  }

  getOrders(userId: string): Observable<any[]> {
    return of([
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        userId,
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'FULFILLED',
        items: [
          {
            id: '1',
            productId: '1',
            name: 'Premium Laptop Pro 15',
            image: 'https://via.placeholder.com/100x100?text=Laptop',
            quantity: 1,
            price: 89999,
            total: 89999
          }
        ],
        pricing: {
          subtotal: 89999,
          discount: 0,
          tax: 16200,
          shipping: 0,
          total: 106199,
          currency: 'INR'
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        timeline: {
          placedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          confirmedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          shippedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      }
    ]).pipe(delay(500));
  }
}

// Made with Bob
