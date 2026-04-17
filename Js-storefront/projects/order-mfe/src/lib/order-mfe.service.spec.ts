import { TestBed } from '@angular/core/testing';

import { OrderMfeService } from './order-mfe.service';

describe('OrderMfeService', () => {
  let service: OrderMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
