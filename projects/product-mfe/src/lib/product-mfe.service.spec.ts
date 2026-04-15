import { TestBed } from '@angular/core/testing';

import { ProductMfeService } from './product-mfe.service';

describe('ProductMfeService', () => {
  let service: ProductMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
