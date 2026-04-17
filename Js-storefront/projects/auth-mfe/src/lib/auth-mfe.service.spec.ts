import { TestBed } from '@angular/core/testing';

import { AuthMfeService } from './auth-mfe.service';

describe('AuthMfeService', () => {
  let service: AuthMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
