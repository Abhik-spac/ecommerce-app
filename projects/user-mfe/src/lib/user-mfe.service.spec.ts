import { TestBed } from '@angular/core/testing';

import { UserMfeService } from './user-mfe.service';

describe('UserMfeService', () => {
  let service: UserMfeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMfeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
