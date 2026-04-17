import { TestBed } from '@angular/core/testing';

import { CheckoutMfeService } from './checkout-mfe.service';

describe('CheckoutMfeService', () => {
  let service: CheckoutMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
