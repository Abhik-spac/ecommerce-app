import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataService } from '@ecommerce/shared';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private mockData: MockDataService) {}

  getProducts(params?: any): Observable<any> {
    return this.mockData.getProducts(params);
  }

  getProductById(id: string): Observable<any> {
    return this.mockData.getProductById(id);
  }

  searchProducts(query: string): Observable<any> {
    return this.mockData.getProducts({ search: query });
  }
}

// Made with Bob
