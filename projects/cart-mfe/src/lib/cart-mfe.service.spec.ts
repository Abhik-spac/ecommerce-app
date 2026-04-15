import { TestBed } from '@angular/core/testing';

import { CartMfeService } from './cart-mfe.service';

describe('CartMfeService', () => {
  let service: CartMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
